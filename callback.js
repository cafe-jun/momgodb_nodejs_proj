// Chaining

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

const addSumPromise = (a, b) =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') return reject('a,b must be numbers');
            resolve(a + b);
        }, 3000);
    });

const totalSum = async () => {
    try {
        let sum = await addSum(10, 10);
        let sum2 = await addSum(sum, 10);
        console.log({ sum, sum2 });
    } catch (error) {
        if (error) console.log({ error });
    }
};

addSumPromise(10, 20)
    .then((sum) => console.log({ sum }))
    .catch((error) => console.log(error));

// 값을 바인딩 할때 최상당 부모 변수에서 해당 콜백 스코프로 할당을 해주어야함
addSumPromise(10, 20)
    .then((sum) => addSumPromise(sum, 1))
    .then((sum) => addSumPromise(sum, 1))
    .then((sum) => addSumPromise(sum, 1))
    .then((sum) => console.log('Chaining Promise', { sum }))
    .catch((error) => console.log(error));

addSum(10, 20, callback); // 30
addSum(10, 'abcad', callback); // error

addSum(10, 20, (error, sum) => {
    if (error) return console.log({ error });
    console.log({ sum });
    addSum(10, 'abcad', (error, sum) => {
        if (error) return console.log({ error });
        console.log({ sum });
        addSum(10, 'abcad', (error, sum) => {
            if (error) return console.log({ error });
            console.log({ sum });
            addSum(10, 'abcad', (error, sum) => {
                if (error) return console.log({ error });
                console.log({ sum });
            }); // error
        }); // error
    }); // error
}); // 30

// console.log('start');

// setTimeout(function () {
//     console.log(`your meal is read`);
// }, 3000);

// console.log('end');
