
const replaceArrayElementById = (array, newElement) => array.map(element => element.id === newElement.id ? newElement : element)

const getElementFromArrayById = (array, id) => array.find(element => element.id === id)

const deleteElementFromArrayById = (array, id) => array.filter(element => element.id !== id)

module.exports = {
    replaceArrayElementById,
    getElementFromArrayById,
    deleteElementFromArrayById
}