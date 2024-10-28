import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("name é necessário"),
  matricula: Yup.number()
    .required("Matrícula é necessária")
    .integer("Matrícula deve ser um número inteiro")
    .max(999, "Matrícula deve ter 3 digitos"),
  user: Yup.string().required("User é necessario"),
  password: Yup.string().required("Password é necessaria"),
});

export default validationSchema;
