import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import NewBillUI from "../views/NewBillUI.js";
import LoginUI from "../views/LoginUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const user = {
        email: "azerty@test.com",
        type: "Employee",
      };

      localStorage.setItem("user", JSON.stringify(user));

      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;

      const divIcon = screen.getByTestId("icon-window");
      const result = divIcon.classList.contains("active-icon");

      expect(result).toBe(true);
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

  test("when i click on newBill button , I should be on NewBill Page", () => {
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const buttonNewBill = screen.getByTestId("btn-new-bill");
    buttonNewBill.click((document.body.innerHTML = NewBillUI()));

    const form = screen.getByTestId("form-new-bill");
    expect(form).toBeDefined();
  });

  test("when I click on disconnect buutton, I should be disconnected and I should be on Login Page", () => {
    const html = BillsUI({ data: [] });
    document.body.innerHTML = html;

    const buttonLogout = document.getElementById("layout-disconnect");
    buttonLogout.click((document.body.innerHTML = LoginUI()));

    const form = screen.getByTestId("form-employee");
    expect(form).toBeDefined();
  });
});
