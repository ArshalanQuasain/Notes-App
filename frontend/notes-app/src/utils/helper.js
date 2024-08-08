export const validateEmail = (email) => {
    // Regex pattern for basic email validation
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
};

export const initials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";

    for (let i =0; i<Math.min(words.length,2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase() ; 
}