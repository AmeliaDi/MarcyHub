export function defaultAdmins() {
  return [
    { email: "draenora@unam.edu", password: "admin1234", createdAt: "Inicial" },
    { email: "profesor@enes.unam.mx", password: "admin1234", createdAt: "Inicial" }
  ];
}

export function defaultTasks() {
  const now = new Date();
  const plusDays = (d) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString();
  };
  return [
    { id: 1, subjectClave: "306", title: "Serie de ejercicios 4: Integrales triples", desc: "Resolver ejercicios del capítulo 15, secciones 15.6-15.8 del Stewart.", due: plusDays(2), completed: false },
    { id: 2, subjectClave: "307", title: "Implementación de Árbol AVL", desc: "Programar inserción, eliminación y balanceo en un árbol AVL en C++.", due: plusDays(1), completed: false }
  ];
}

export function defaultResources() {
  return [
    { id: 1, subjectClave: "306", type: "pdf", title: "Cálculo de varias variables", author: "James Stewart", link: "stewart-calculo-var.pdf", fileData: null, unit: "Unidad 1", uploadedBy: "Prof. Isaac Arelio", uploadedAt: "2024-01-15" }
  ];
}