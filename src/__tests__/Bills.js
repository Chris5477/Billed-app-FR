import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import LoginUI from "../views/LoginUI.js";
import Bill from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import Logout from "../containers/Logout.js";
import Login from "../containers/Login.js";

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

      localStorage.setItem("user", JSON.stringify(user))
      document.body.innerHTML = LoginUI();

      screen.getByTestId("employee-email-input").value = "topher@gmail.com";
      screen.getByTestId("employee-password-input").value = "azerty";

      const logUser = new Login({ document, onNavigate, undefined, localStorage });
      const handleSubmitEmployee = jest.fn(logUser.handleSubmitEmployee);

      const btnSubmitEmployee = screen.getByTestId("employee-login-button");
      btnSubmitEmployee.addEventListener("click", (e) => handleSubmitEmployee);
      userEvent.click(btnSubmitEmployee);
      const checkClass = screen.getByTestId("icon-window").classList.contains("active-icon")
      console.log(checkClass)
      expect(checkClass).toBeTruthy()

      // localStorage.setItem("user", JSON.stringify(user));

      // const html = BillsUI({ data: [] });
      // document.body.innerHTML = html;

      // const divIcon = screen.getByTestId("icon-window");
      // const result = divIcon.classList.contains("active-icon");

      // expect(result).toBe(true);
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
    document.body.innerHTML = BillsUI({ data: bills });
    const iconEye = screen.getAllByTestId("icon-eye");

    const seeProof = new Bill({ document, onNavigate, undefined, localStorage });

    const handleClickIconEye = jest.fn(seeProof.handleClickIconEye);
    iconEye[1].addEventListener("click", () => handleClickIconEye(iconEye[1]));
    userEvent.click(iconEye[1]);
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
