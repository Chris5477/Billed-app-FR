import { fireEvent, screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes.js";

import "@testing-library/jest-dom";

describe("Given I am connected as an employee I am on NewBill Page ", () => {
  test("it should highlight logo newBill", () => {
    const html = NewBillUI();
    document.body.innerHTML = html;

    const emailIcon = screen.getByTestId("icon-mail");
    const checkClass = emailIcon.classList.contains("active-icon");
    expect(checkClass).toBeTruthy();
  });
});

test("When I do not fill fields and I click on button send, I should stay on NewBill page ", () => {
  const html = NewBillUI();
  document.body.innerHTML = html;

  const user = {
    type: "Employee",
    email: "azerty@test.com",
    password: "azerty",
    status: "connected",
  };

  localStorage.setItem("user", JSON.stringify(user))

  const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

  const dataNoValid = new NewBill({document, onNavigate, undefined, localStorage})
  const handleSubmit = jest.fn(dataNoValid.handleSubmit)
  const mock = jest.fn().mockReturnValue("");

  const inputs = [...document.querySelectorAll("input")];
  const fillInput = inputs.map((el) => (el.value = mock()));

  const buttonNewBill = document.getElementById("btn-send-bill");

  
  const result = fillInput.every((element) => element === "");
  expect(result).toBeTruthy();
  buttonNewBill.addEventListener("click", (e) => handleSubmit);
  userEvent.click(buttonNewBill);
  expect(screen.getByText("Mes notes de frais")).toBeTruthy()

});

describe("I fill inputs with correct format except input file", () => {
  test("I should stayed on NewBil Page and i'm invit to fill the inputs with wrong format", () => {

    const user = {
      type: "Employee",
      email: "azerty@test.com",
      password: "azerty",
      status: "connected",
    };

    localStorage.setItem("user", JSON.stringify(user))

    const html = NewBillUI();
    document.body.innerHTML = html;

    const onNavigate = pathname => document.body.innerHTML = ROUTES({pathname})

    const nwBill = new NewBill({document, onNavigate, undefined, localStorage})

    const handleSubmit = jest.fn(nwBill.handleSubmit)
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

    buttonNewBill.addEventListener("click",(e) => handleSubmit)
    userEvent.click(buttonNewBill)
    expect(screen.getByText("Mes notes de frais")).toBeTruthy()
  });
});

describe("I input a proof with bad extension", () => {
  test("Then it should alert the user that the format of proof is not correct and to empty the fileds", () => {
    const files = ["azerty.mp3", "azerty.jpg"];
    const html = NewBillUI();
    document.body.innerHTML = html;

    const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

    const inputFile = screen.getByTestId("file");

    const addNewBill = new NewBill({ document, onNavigate, undefined, localStorage });
    const handleChangeFile = jest.fn(addNewBill.handleChangeFile);
    inputFile.addEventListener("change", handleChangeFile);
    fireEvent.change(inputFile, { target: { file: files[1] } });

    expect(handleChangeFile).toHaveBeenCalled();
    expect(screen.getByText("Veuillez saisir un format avec une extension valide(jpg, jpeg ou png)")).toBeTruthy();

    // const inputFile = screen.getByTestId("file");

    // const obj = {
    //   document: window,
    //   onNavigate,

    //   changeFile: function () {
    //     const span = document.querySelector(".error-msg");
    //     inputFile.file = files.file1;
    //     const extension = /(.png|.jpg|.jpeg)$/;
    //     if (!inputFile.file.match(extension)) {
    //       document.querySelector(`input[data-testid="file"]`).value = "";
    //       span.innerHTML = "Veuillez saisir un format avec une extension valide(jpg, jpeg ou png)";
    //     }
    //   },
    // };

    // inputFile.addEventListener("click", obj.changeFile);
    // userEvent.click(inputFile);
    // const span = screen.getByTestId("wrong-file");
    // const result = span.innerHTML === "Veuillez saisir un format avec une extension valide(jpg, jpeg ou png)";
    // expect(result).toBeTruthy();
  });
});

describe("I fill all fields with correct format and i click on button send", () => {
  test("It should redirect user on Bills Page and I should see my new bill on list of bill", () => {
    const onNavigate = (pathname) => (document.body.innerHTML = ROUTES({ pathname }));

    const file = {
      file1: "src/assets/images/facturefreemobile.jpg",
    };

    const user = {
      type: "Employee",
      email: "azerty@test.com",
      password: "azerty",
      status: "connected",
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

// TEST SUR LE RETOUR EN ARRIERE A ECRIRE//
