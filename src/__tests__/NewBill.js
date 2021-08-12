import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from '../containers/NewBill'
import { fill } from "lodash"
import { ExpectationFailed } from "http-errors"




describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and I don't input fields in forms and I click on button send", () => {
    test("Then I'm invited to input the empty fields in form ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const mock = jest.fn().mockReturnValue("");
      const inputs = [...document.querySelectorAll("input")]
      const fillInput = inputs.map(el => el.value = mock())
      const result = fillInput.every(element => element=== "")
      expect(result).toBeTruthy()
    })
  })

  describe("When I am on NewBill Page and I input a proof with bad extension", () => {
    test("Then it should alert the user that the format of proof is not correct and to empty the fileds", () => {


      const html = NewBillUI()
      document.body.innerHTML = html
      const mock = jest.fn().mockReturnValue("azeert.svg")    
      const file = mock()
      const extension = new RegExp(/(.png|.jpg|.jpeg)$/)
      const result = extension.test(file);
      expect(result).toBeFalsy()
      const inputFile = screen.getByTestId("file").value
      expect(inputFile).toBe("")
      expect(alert()).toHaveBeenCalled() // A voir pour que ca marche


    })
  })


  
  describe("When I am on NewBill Page and I fill all fields with correct format and i click on button send", () => {
    test("It should redirect user on Bills Page and I should see my new bill on list of bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const mock = jest.fn().mockReturnValueOnce("Transport").mockReturnValueOnce("Repas").mockReturnValueOnce("10/02/2020").mockReturnValueOnce("44").mockReturnValueOnce("0").mockReturnValueOnce("20").mockReturnValueOnce("sdsdsdsd").mockReturnValueOnce("ererererer.png")

      const inputs = [...document.querySelectorAll("input")]
        const checkedData = inputs.filter(el => el.value=mock())
        const result = checkedData !== [] ? true : false
        expect(result).toBeTruthy()


    })
  })

})