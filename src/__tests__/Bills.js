import { fireEvent, screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import LoginUI from "../views/LoginUI.js";
import Bill from "../containers/Bills.js";
import { ROUTES } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import Logout from "../containers/Logout.js";
import Login from "../containers/Login.js";
import firebase from "../__mocks__/firebase.js"

describe("Given I am connected as an employee", () => {
  const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const user = {
        email: "topher@gmail.com",
        password: "wxcvbn",
        status: "connected",
        type: "Employee",
      };

      localStorage.setItem("user", JSON.stringify(user));
      document.body.innerHTML = LoginUI();

      screen.getByTestId("employee-email-input").value = "topher@gmail.com";
      screen.getByTestId("employee-password-input").value = "azerty";

      const logUser = new Login({ document, onNavigate, undefined, localStorage });
      const handleSubmitEmployee = jest.fn(logUser.handleSubmitEmployee);

      const btnSubmitEmployee = screen.getByTestId("employee-login-button");
      btnSubmitEmployee.addEventListener("click", (e) => handleSubmitEmployee);
      userEvent.click(btnSubmitEmployee);
      if(document.body.innerHTML = BillsUI({data : [], loading : true})){
        expect(screen.getAllByText("Loading...")).toBeTruthy()
      }
      const checkClass = screen.getByTestId("icon-window").classList.contains("active-icon");
      expect(checkClass).toBeTruthy();

    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  test("When I click on icon-eye, i should see the proof join on bill", () => {
    const html = BillsUI({ data: bills });
    document.body.innerHTML = html;

    $.fn.modal = jest.fn();

    const bill = new Bill({ document, onNavigate, undefined, localStorage });
    const handleClickIconEye = jest.fn(bill.handleClickIconEye);

    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    iconEye.forEach((icon) => {
      icon.addEventListener("click", () => handleClickIconEye(icon));
      fireEvent.click(icon);
    });

    expect(handleClickIconEye).toHaveBeenCalled();
    expect(screen.getByText("Justificatif")).toBeTruthy();
  });

  test("When I click on newBill button , I should be on NewBill Page", () => {
    const user = {
      type: "Employee",
      email: "azerty@test.com",
      password: "azerty",
      status: "connected",
    };

    document.body.innerHTML = BillsUI({ data: [] });

    const addBill = new Bill({ document, onNavigate, undefined, localStorage });
    const handleClickNewBill = jest.fn(addBill.handleClickNewBill);

    const btnAddBill = screen.getByTestId("btn-new-bill");
    btnAddBill.addEventListener("click", handleClickNewBill);
    userEvent.click(btnAddBill);
    expect(handleClickNewBill).toHaveBeenCalled();
    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
  });

  test("when I click on disconnect buutton, I should be disconnected and I should be on Login Page", () => {
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const logout = new Logout({ document, onNavigate, localStorage });

    const handleClick = jest.fn(logout.handleClick);

    const buttonLogout = document.getElementById("layout-disconnect");
    buttonLogout.addEventListener("click", handleClick);
    userEvent.click(buttonLogout);
    expect(handleClick).toHaveBeenCalled();
    expect(screen.getByText("Administration")).toBeTruthy();

    const form = screen.getByTestId("form-employee");
    expect(form).toBeDefined();
  });

  
  
});

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate in Bills page", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})