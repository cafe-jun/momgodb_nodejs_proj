const addSumPromise = (a, b) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') return reject('a,b must be numbers');
            resolve(a + b);
        }, 3000);
    });

addSumPromise(10, 20)
    .then((sum) => console.log({ sum }))
    .catch((error) => console.log(error));

const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') return callback('a,b must be numbers');
        callback(undefined, a + b);
    }, 3000);
};

let callback = (error, sum) => {
    if (error) return console.log({ error });
    console.log({ sum });
};

addSum(10, 20, callback); // 30
addSum(10, 'abcad', callback); // error

// console.log('start');

// setTimeout(function () {
//     console.log(`your meal is read`);
// }, 3000);

// console.log('end');
