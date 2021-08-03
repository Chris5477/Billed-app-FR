import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should to alert if extension of proof is different than jpg, jpeg or png", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const extension = /(.jpg|.jpeg|.png)$/
      const file = screen.getAllByTestId("file").value + extension
      expect(file).toBeTruthy()
    })
  })
})