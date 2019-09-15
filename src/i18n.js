import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            Login: "Login",
            LoginTitle: "Login",
            Signup: "Signup",
            Profile: "Profile",
            Users: "Users",
            Logout: "Logout",
            Medications: "Medications",
            Prescriptions: "Prescriptions",
            RegisterLink: "Do not have accout? Sign up <0>here</0>",
            LoginLink: "Already have an accout? Login <0>here</0>",
            Password: "Password",
            DeleteButton: "Delete",
            AddButton: "Add",
            EditButton: "Edit",
            CancelButton: "Cancel",
            "Save changes": "Are you sure you want to save changes?",
            Medication: "medication",
            "Save changes dialog title": "Save changes",
            AddMedicationBtn: "Add med",
            EditMedicationBtn: "Edit",
            DeleteMedicationBtn: "Delete",
            SaveMedicationBtn: "Save",
            CancelMedicationBtn: "Cancel",
            ColumnMedName: "Name",
            ColumnDoseUnit: "Dose unit",
            ColumnDose: "Dose",
            ColumnMedicationStart: "Medication start",
            ColumnMedicationEnds: "Medication ends",
            ColumnAddedBy: "Added by",
            FilterInputLabel: "Filter...",
            Payment: "Payment:",
            "Date of issue": "Date of issue",
            "Prescription number": "Prescription number",
            Doctor: "Doctor",
            "Doctor email": "Doctor email",
            "Date of realization to": "Date of realization to",
            "Add prescription": "Add prescription",
            "Create prescription": "Create prescription",
            "Realize to": "Realize to",
            "Medication informations": "Medication informations",
            "Payment prescription label": "Payment",
            Search: "Search...",
            "No data": "No data",
            Surname: "Surname",
            "License number": "License number",
            "Member since": "Member since",
            "Signup title": "Signup",
            Name: "Name",
            "Confirm password": "Confirm password"
        }
    },
    pl: {
        translation: {
            Login: "Zaloguj się",
            LoginTitle: "Logowanie",
            Signup: "Zarejestruj się",
            Profile: "Profil",
            Users: "Użytkownicy",
            Logout: "Wyloguj się",
            Medications: "Leki",
            Prescriptions: "Recepty",
            RegisterLink: "Nie masz konta? Zarejestruj się  <0>tutaj</0>",
            LoginLink: "Masz konto? Zaloguj się <0>tutaj</0>",
            Password: "Hasło",
            DeleteButton: "Usuń",
            AddButton: "Dodaj",
            EditButton: "Edytuj",
            CancelButton: "Anuluj",
            "Save changes": "Chcesz zapisać zmiany?",
            Medication: "lek",
            "Save changes dialog title": "Zapisz zmiany",
            AddMedicationBtn: "Dodaj lek",
            EditMedicationBtn: "Edytuj",
            DeleteMedicationBtn: "Usuń",
            SaveMedicationBtn: "Zapisz",
            CancelMedicationBtn: "Anuluj",
            ColumnMedName: "Nazwa",
            ColumnDoseUnit: "Forma leku",
            ColumnDose: "Dawka",
            ColumnMedicationStart: "Zażywaj od",
            ColumnMedicationEnds: "Zażywaj do",
            ColumnAddedBy: "Dodane przez",
            FilterInputLabel: "Filtruj...",
            Payment: "Odpłatność:",
            "Date of issue": "Data wydania",
            "Prescription number": "Numer recepty",
            Doctor: "Lekarz",
            "Doctor email": "Email lekarza",
            "Date of realization to": "Zrealizuj do",
            "Add prescription": "Dodaj receptę",
            "Create prescription": "Tworzenie recepty",
            "Realize to": "Zrealizuj do",
            "Medication informations": "Informacje o leku",
            "Payment prescription label": "Odpłatność",
            Search: "Szukaj...",
            "No data": "Brak danych",
            Surname: "Nazwisko",
            "License number": "Numer wykonywania zawodu",
            "Member since": "Data założenia konta",
            "Signup title": "Rejestracja",
            Name: "Imię",
            "Confirm password": "Potwierdź hasło"
        }
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "pl",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
