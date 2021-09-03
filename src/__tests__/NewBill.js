import { fireEvent, screen, createEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bill from "../containers/Bills";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes.js";
import firestore from "../app/Firestore.js";
import firebase from "../__mocks__/firebase.js"

import "@testing-library/jest-dom";


describe("Given I am a user connected as Employee and I am on NewBill Page ", () => {
  const user = {
    type: "Employee",
    email: "azerty@test.com",
    password: "azerty",
    status: "connected",
  };
  describe("When I navigate on NewBill page", () => {
    test("then I should see newBill icon  highlighted", () => {
      document.body.innerHTML = BillsUI({ data: [] });

      const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

      const addBill = new Bill({ document, onNavigate, undefined, localStorage });
      const handleClickNewBill = jest.fn(addBill.handleClickNewBill);
      const btnAddBill = screen.getByTestId("btn-new-bill");
      btnAddBill.addEventListener("click", handleClickNewBill);
      userEvent.click(btnAddBill);
      const emailIcon = screen.getByTestId("icon-mail");
      const checkClass = emailIcon.classList.contains("active-icon");
      expect(checkClass).toBeTruthy();
    });
  });
  describe("When I do not fill fields and I click on button send", () => {
    test("Then I should stay on NewBill page ", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      localStorage.setItem("user", JSON.stringify(user));

      const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

      const dataNoValid = new NewBill({ document, onNavigate, undefined, localStorage });
      const handleSubmit = jest.fn(dataNoValid.handleSubmit);
      const mock = jest.fn().mockReturnValue("");

      const inputs = [...document.querySelectorAll("input")];
      const fillInput = inputs.map((el) => (el.value = mock()));

      const buttonNewBill = document.getElementById("btn-send-bill");

      const result = fillInput.every((element) => element === "");
      expect(result).toBeTruthy();
      buttonNewBill.addEventListener("click", (e) => handleSubmit);
      userEvent.click(buttonNewBill);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });

  describe("I fill inputs with correct format except input file", () => {
    test("then I should stay on NewBil Page and i'm invit to fill the inputs with good format", () => {
      localStorage.setItem("user", JSON.stringify(user));

      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

      const nwBill = new NewBill({ document, onNavigate, undefined, localStorage });

      const handleSubmit = jest.fn(nwBill.handleSubmit);
      const buttonNewBill = document.getElementById("btn-send-bill");

      const mock = jest.fn().mockReturnValueOnce("10/10/2021").mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce("");

      const inputData = (screen.getByTestId("datepicker").value = mock());
      const inputPrice = (screen.getByTestId("amount").value = mock());
      const inputTva = (screen.getByTestId("pct").value = mock());
      const inputProof = (screen.getByTestId("file").file = mock());
      expect(inputData).not.toBeNull();
      expect(inputPrice).not.toBeNull();
      expect(inputTva).not.toBeNull();
      expect(inputProof).not.toBeNull();

      buttonNewBill.addEventListener("click", (e) => handleSubmit);
      userEvent.click(buttonNewBill);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });

  describe("I fill a proof with bad extension", () => {
    test("Then it should alert the user that the format of proof is not correct and to empty the fileds", () => {
      const aaa = [new File(["(⌐□_□)"], "chucknorris.svg", { type: "image/svg" })];

      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

      const inputFile = screen.getByTestId("file");

      const addNewBill = new NewBill({ document, onNavigate, firestore, localStorage });
      const handleChangeFile = jest.fn(addNewBill.handleChangeFile);

      inputFile.addEventListener("input", handleChangeFile);
      fireEvent(
        inputFile,
        createEvent("input", inputFile, {
          target: { files: aaa },
        })
      );
      expect(handleChangeFile).toHaveBeenCalled();
      expect(screen.getByText("Veuillez saisir un format avec une extension valide(jpg, jpeg ou png)")).toBeDefined();
    });
  });

  describe("I fill all fields with correct format and i click on button send", () => {
    test("Then It should redirect user on Bills Page and I should see my new bill on list of bill", () => {
      const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

      const file = {
        file1: "src/assets/images/facturefreemobile.jpg",
      };

      localStorage.setItem("user", JSON.stringify(user));

      const html = NewBillUI();
      document.body.innerHTML = html;

      const validBill = new NewBill({ document, onNavigate, undefined, localStorage });
      const handleSubmit = jest.fn(validBill.handleSubmit);

      const mock = jest.fn().mockReturnValueOnce("10/10/2021").mockReturnValueOnce(10).mockReturnValueOnce(20).mockReturnValueOnce(file.file1);
      const btn = document.getElementById("btn-send-bill");

      const inputs = [];

      const inputData = (screen.getByTestId("datepicker").value = mock());
      const inputPrice = (screen.getByTestId("amount").value = mock());
      const inputTva = (screen.getByTestId("pct").value = mock());
      const inputProof = (screen.getByTestId("file").file = mock());
      inputs.push(inputData, inputPrice, inputTva, inputProof);
      expect(!inputs.every((el) => el === "")).not.toBeNull();
      btn.addEventListener("click", (e) => handleSubmit);
      userEvent.click(btn);
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
    });
  });
});

describe("When I navigate in Bills page", () => {
  test("fetches bills from mock API Post", async () => {
    

      const newBill = {
        "id": "qcCK3SzECmaZAGRrHjaC",
        "status": "refused",
        "pct": 20,
        "amount": 200,
        "email": "a@a",
        "name": "test8",
        "vat": "40",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2002-02-02",
        "commentAdmin": "pas la bonne facture",
        "commentary": "test8",
        "type": "Restaurants et bars",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      }
   
            
             const getSpy = jest.spyOn(firebase, "post")
             const bills = await firebase.post(newBill) 
             const addBill = [...bills.data, newBill]
             expect(getSpy).toHaveBeenCalledTimes(1)
             expect(addBill.length).toBe(5)
             expect(addBill[4].name).toBe("test8")
            
          })
  
}); 