const formatDate = (dateString) => {
    const date = new Date(dateString); // Convertit la chaîne de date en objet Date
    const day = String(date.getDate()).padStart(2, "0"); // Jour avec zéro initial
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Mois (indexé à partir de 0, donc +1)
    const year = String(date.getFullYear()).slice(-2); // Année sur deux chiffres
    return `${day}/${month}/${year}`;
};
export default formatDate;