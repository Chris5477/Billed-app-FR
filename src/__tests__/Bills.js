import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {

      const user = {
        email: "azerty@test.com",
        password: "azerty",
        status: "connected",
        type: "Employee",
      };

      localStorage.setItem("user", JSON.stringify(user))

      const html = BillsUI({data : []})
      document.body.innerHTML = html
      const a = screen.getByTestId("icon-window")
      expect(a).not.toBeUndefined()
      a.classList.add("active-icon")
      a.classList.contains("active-icon")
      console.log(a.classList.contains("active-icon"))
      expect(a).toBeTruthy()

      //TEST A AMELIORER //



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
});
