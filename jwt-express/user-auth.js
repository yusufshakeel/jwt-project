const userAuth = (username, password) => {
    const users = [
        {
            username: 'yusuf',
            password: 'password'
        },
        {
            username: 'john',
            password: 'password'
        },
        {
            username: 'jane',
            password: 'password'
        }
    ];
    const matchingUser = users.find(user => user.username === username && user.password === password);
    return { isValid: !!matchingUser };
};

module.exports = { userAuth };