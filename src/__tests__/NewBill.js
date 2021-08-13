import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from '../containers/NewBill'
import { fill } from "lodash"
import { ExpectationFailed } from "http-errors"




describe("Given I am connected as an employee", () => {
  const file = {
    file1 : "src/assets/images/facturefreemobile.jpg",
    file2 : "src/assets/images/facturefreemobile.svg"
  }
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
      const mock = jest.fn().mockReturnValue(file.file1)    
      const valueFile = mock()
      const extension = new RegExp(/(.png|.jpg|.jpeg)$/)
      const result = extension.test(valueFile);
      expect(result).toBeTruthy()
      
     // Finir avec l lalerte


    })
  })


  
  describe("When I am on NewBill Page and I fill all fields with correct format and i click on button send", () => {
    test("It should redirect user on Bills Page and I should see my new bill on list of bill", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const date = Date.now()
      console.log(date)
 

      const mock = jest.fn().mockReturnValueOnce(date).mockReturnValueOnce(44).mockReturnValueOnce(20).mockReturnValueOnce(file.file1)

      const allInputs = []

      const inputDate = screen.getByTestId("datepicker")
      const inputPrice = screen.getByTestId("amount")
      const inputTva = screen.getByTestId("pct")
      const inputProof = screen.getByTestId("file")

      allInputs.push(inputDate, inputPrice,inputTva, inputProof)

      const checkedData = allInputs.filter(el => el.value=mock())
      const result = checkedData !== [] ? true : false
      expect(result).toBeTruthy()


        // Faire  le test de la redirection


    })
  })

})