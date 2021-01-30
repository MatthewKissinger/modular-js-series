// in the revealing module pattern you don't need an init function

// events (publish subscribe) pattern

var events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }; 
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};


// stats module
var stats = (function() {

    var people = 0;

    //cache DOM
    let stats = document.querySelector('#statsContainer');

    //bind events
    events.on('peopleChanged', setPeople);  // subpub enabled

    _render();

    function _render() {
        stats.innerHTML = template(people);
    }

    function template(total) {
        return `<h3>People: ${total}</h3>`; 
    }

    function setPeople(newPeople) {
        people = newPeople;
        _render();
    }

    function destroy() {
        stats.remove();
        events.off('peopleChanged', setPeople);
    }

    return {
        destroy: destroy
    }

})();

// people module
var people = (function() {
    var people = ["Matt", "Jenna"];

    // cacheDOM
    let el = document.querySelector('#peopleModule');
    let button = el.querySelector('button');
    let input = el.querySelector('input');
    let ul = el.querySelector('ul'); 

    //bind events
    button.addEventListener('click', addPerson);
    ul.addEventListener('click', removePerson);

    render();

    function render() {
        ul.innerHTML = '';
        people.forEach((name) => {
        ul.innerHTML += template(name);
        });
        // stats.setPeople(people.length);
        // pusub version
        events.emit("peopleChanged", people.length);  // emits the function setPeople with the value of people.length
    }

    function template(name) {
        return `<li data-index="${people.indexOf(name)}">
                <span>${name}</span>
                <i class="del">X</i>
                </li>`; 
    }

    function addPerson(value) {
        let name = (typeof value === "string") ? value : input.value;
        if (name === '') {
            return;
        } else {
            people.push(name);
            render();
            input.value = '';
        }
    }

    function removePerson(e) {
        const target = e.target;
        let index;
        let targetParent;

        if (typeof e === "number") {
            index = e;
            let liList = ul.querySelectorAll('li');
            let liArray = Array.from(liList);
            liArray.forEach((node) => {
                if (node.dataset.index == index) {
                    ul.removeChild(node);
                }
            })
            people.splice(index, 1);
            render();
        } else if (target.matches("i.del")) {
            targetParent = target.parentElement;
            ul.removeChild(targetParent);
            index = people.indexOf(targetParent.querySelector('span').innerText);
            people.splice(index, 1);
            render();
        }
    }

    function showPeople() {
        console.log(people);
    }

    return {
        addPerson: addPerson,
        removePerson: removePerson,
        showPeople: showPeople
    }

})();

//instances
// classical inheritance

// var Person = function(name) {
//     this.name = name.toUpperCase();
// };

// Person.prototype.sayName = function() {
//     console.log(`Hi my name is ${this.name}`);
// }

// // Person extension that calls on the super constructor function
// var Writer = function(name, genre) {
//     Person.call(this, name);
//     this.genre = genre;
// }

// // inherit the methods from Person
// Writer.prototype = Object.create(Person.prototype); 
// // set the constructor of Writer to itself -- it defaults to the super after inheriting the protypal methods
// Writer.prototype.constructor = Writer;

// Writer.prototype.getGenre = function() {
//     console.log(this.genre);
// }


// var john = new Person("john");
// var bobby = new Person("bobby");

// var jenna = new Writer("jenna", "dramedy");

// jenna.sayName();
// jenna.getGenre();



// prototypal inheritance

var human = {
    species: "human", 
    create: function(values) {
        var instance = Object.create(this);
        Object.keys(values).forEach(function(key) {
            instance[key] = values[key];
        });
        return instance;
    },
    saySpecies: function() {
        console.log(this.species);
    },
    sayName: function() {
        console.log(`Hi, my name is ${this.name}`);
    }
};


// using the create function to inherit methods and properties from super and also adding new properties and methods passed into the create function as an object
var musician = human.create({
    species: "musician",
    playInstrument: function() {
        console.log(`plays ${this.instrument}`);
    },
});

var will = musician.create({
    name: "will",
    instrument: "guitar"
});

