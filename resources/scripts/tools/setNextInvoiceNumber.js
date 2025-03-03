export default function (currentNumber) {
    if(!Number(currentNumber)) {
        return 1;
    }

    currentNumber++
    return currentNumber;
}