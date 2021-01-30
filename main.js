console.log('hi there');


// wrapped in an anonymous function so there are no global variables 
(function() {
    var people = {
        people: ['Matt', 'Jenna', 'Finn', 'Poe'], 
        template: function(name) {
            return `<li>
                    <span>${name}</span>
                    <i class="del">X</i>
                    </li>`; 
        },
        // init functions are designed to kick off the module
        init: function() {
            this.cacheDom();
            this.bindEvents();
            this.render();
        }, 
        cacheDom: function() {
            this.el = document.querySelector('#peopleModule');
            this.button = this.el.querySelector('button');
            this.input = this.el.querySelector('input');
            this.ul = this.el.querySelector('ul');
        },
        bindEvents: function() {
            this.button.addEventListener('click', this.addPerson.bind(this));
            this.ul.addEventListener('click', this.removePerson.bind(this));
        },
        render: function() {
            this.ul.innerHTML = '';
            this.people.forEach((name) => {
                this.ul.innerHTML += people.template(name);
            });
        },
        addPerson: function() {
            if (this.input.value === '') {
                return;
            } else {
                this.people.push(this.input.value);
                this.render();
                this.input.value = '';
            }
            
        },
        removePerson: function(e) {
            const target = e.target;
            const targetParent = target.parentElement;
            const index = this.people.indexOf(targetParent.querySelector('span').innerText);

            if (target.matches("i.del")) {
                this.ul.removeChild(targetParent);
                this.people.splice(index, 1);
                this.render();
            }
        }
    };
    // run the init function to initialize the module
    people.init(); 
})();
    
