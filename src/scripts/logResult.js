// A basic dummy wrapper around a console.log call
// This is used for compatibility with the gui version of these scripts

const logResult = (...output) => {
    output.map(content => console.log(content))
}

export default logResult;