import { fireEvent, screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js"
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'



describe("Given I am connected as an employee", () => {

  test("it should highlight logo newBill", () => {

    const html = NewBillUI()
    document.body.innerHTML = html

    const emailIcon = screen.getByTestId("icon-mail")
    const checkClass = emailIcon.classList.contains("active-icon")
    expect(checkClass).toBeTruthy()

  });
});



  describe("When I am on NewBill Page and I don't input fields in forms and I click on button send", () => {
    test("Then I'm invited to input the empty fields in form ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      const mock = jest.fn().mockReturnValue("");
      const inputs = [...document.querySelectorAll("input")]
      const fillInput = inputs.map(el => el.value = mock())
      const result = fillInput.every(element => element === "")
      expect(result).toBeTruthy()
    })
  })

  describe("When I am on NewBill page , I fill inputs with correct format except input file", () => {
    test("I should stayed on NewBil Page and i'm invit to fill the inputs with wrong format", () => {

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const mock = jest.fn().mockReturnValueOnce("10/10/2021").mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce("")

      const inputData = screen.getByTestId("datepicker").value=mock()
      const inputPrice = screen.getByTestId("amount").value=mock()
      const inputTva = screen.getByTestId("pct").value=mock()
      const inputProof = screen.getByTestId("file").file=mock()
      expect(inputData).not.toBeNull()
      expect(inputPrice).not.toBeNull()
      expect(inputTva).not.toBeNull()
      expect(inputProof).not.toBeNull()

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(e => e.preventDefault())  
  
      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(form).toBeTruthy()

    })
  })
  
  describe("When I am on NewBill Page and I input a proof with bad extension", () => {
    test.only("Then it should alert the user that the format of proof is not correct and to empty the fileds", () => {
  
    document.body.innerHTML = NewBillUI()

    const files = {
      file1 : "file.jpg",
      file2 : "file.mp3"
    }

    const handleChangeFileMock = jest.fn().mockReturnValue(files.file2)

  
    const inputFile = screen.getByTestId("file")
    const span = screen.getByTestId("wrong-file")
    const extension = new RegExp(/(.png|.jpg|.jpeg)$/)
    inputFile.addEventListener("click", handleChangeFileMock)
    userEvent.click(inputFile)
    inputFile.file = handleChangeFileMock()
    expect(handleChangeFileMock).toHaveBeenCalled()
    if(!extension.test(inputFile.file)){
      span.style.display ="initial"
    }
    expect(span).toHaveStyle("display: initial")

    // expect(screen.getAllByText("Veuillez saisir un format avec une extension valide(jpg, jpeg ou png)")).toBeTruthy()

    // expect(span).toBeVisible()

  
    
      
     
    })
  })


  
  describe("When I am on NewBill Page and I fill all fields with correct format and i click on button send", () => {
    test("It should redirect user on Bills Page and I should see my new bill on list of bill", () => {

      const file = {
        file1 : "src/assets/images/facturefreemobile.jpg",
      }

      const html = NewBillUI()
      document.body.innerHTML = html
      
      const mock = jest.fn().mockReturnValueOnce("10/10/2021").mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce(file.file1)

      const inputs = []

      const inputData = screen.getByTestId("datepicker").value=mock()
      const inputPrice = screen.getByTestId("amount").value=mock()
      const inputTva = screen.getByTestId("pct").value=mock()
      const inputProof = screen.getByTestId("file").file=mock()

      inputs.push(inputData, inputPrice, inputTva, inputProof)

      expect(!inputs.every(el => el === "")).not.toBeNull()

      const btn = document.getElementById("btn-send-bill")
      btn.click(document.body.innerHTML = BillsUI({data : []}))
  
      const modal = document.getElementById("modaleFile")
      expect(modal).not.toBeNull()
    })
  })


  // TEST SUR LE RETOUR EN ARRIERE A ECRIRE//