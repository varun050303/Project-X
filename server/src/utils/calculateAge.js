export const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate.year, birthdate.month - 1, birthdate.day); // month is 0-indexed

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};