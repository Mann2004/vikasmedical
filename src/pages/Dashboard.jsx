import { addMedicineHistory } from "../services/firestore";

const addMedicine = async () => {
  await addMedicineHistory(userId, {
    medicineName,
    dose,
    date: new Date(),
    notes
  });

  alert("Medicine Added");
};