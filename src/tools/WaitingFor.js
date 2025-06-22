const NumbersTools = require('./Numbers');

module.exports = class WaitingFor {

    async microseconds(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async rangeMicroseconds(start, end){
        return this.microseconds(this.randomFromInterval(start, end));
    }

    randomFromInterval(min, max) {
        return new NumbersTools().randomIntFromInterval(min, max);
    }

}