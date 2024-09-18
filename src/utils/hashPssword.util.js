import bcrypt from "bcrypt";

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
};

const isValid = (password, userPassword) => {
    return bcrypt.compareSync(password, userPassword)
}

export { hashPassword, isValid };