

const {log, biglog, errorlog, colorize} = require("./out");
const model = require('./model');

//porque el rl?
//rl esta definido en main, por lo que les paso como parametro el rl para que lo cojan de main
exports.helpCmd = rl => {
	log('COMANDOS:');
      	log('h|help - Muestra esta ayuda.');
		log('list - Listar los quizzes existentes.');
		log('show <id> - Muestra la pregunta y la respuesta el quiz indicado.');
		log('add - Añadir un nuevo quiz interactivamente.');
  		log('delete <id> - Borrar el quiz indicado.');
  		log('edit <id> - Editar el quiz indicado.');
  		log('test <id> - Probar el quiz indicado.');
  		log('p|play - Jugar a preguntar aleatoriamente todos los quizzes.');	
		log('credits - Créditos.');
		log('q|quit - Salir del programa.');  
		rl.prompt();
};


exports.quitCmd = rl => {
	rl.close();
	
};

//hazme la pregunta, cuando se escriba la pregunta y de a enter ya llama a lo demás para que escribas la respuesta
//prompt tiene que estar dentro, para haber terminado ya con todas las preguntas

exports.addCmd = rl => {

	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{

		rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer =>{

			model.add(question,answer);
			log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta' )} ${answer}`);
			rl.prompt();
			});
		});
	};	


//${} sustituir lo que hay dentro por string o int
exports.listCmd = rl => {
	
	model.getAll().forEach((quiz, id) => {

		log(` [${colorize(id, 'magenta')}] : ${quiz.question } `);
	});

	rl.prompt();
};

exports.showCmd = (rl, id) => {
	
	if (typeof id === "undefined") {
		errorlog('Falta el parametro id. ');
	} else {
		try {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch (error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.testCmd = (rl, id) => {
	
	if (typeof id === "undefined") {
		errorlog('Falta el parametro id. ');

	rl.prompt();

	} else {
		try {
				
			const quiz = model.getByIndex(id);

				rl.question(colorize(quiz.question + "?   ", 'red'), resp => {


					
					if(String(resp.trim().toLowerCase()) === String(quiz.answer.toLowerCase()) ) {
						log ("Su respuesta es correcta.");
						biglog('Correcto','green');
						//log('Correcto','green');
					}
					 	else { log (`[${colorize("Su respuesta es incorrecta.")}]: `);
					 	biglog('Incorrecto','red');
					 	//log('Incorrecto','red');
					 }
					rl.prompt();
			});
		}

		catch (error) {
			errorlog(error.message);
		}
	}

	rl.prompt();

};

exports.playCmd = rl => {
	let score = 0;
	let toBeResolve = [];
	
	const quizzes = model.getAll();
		//log(quizzes);
	for (var i = 0; i < quizzes.length; i++){
		toBeResolve.push(quizzes[i]);
			//log(toBeResolve);
		}
	
	
	const playOne = () => {

		//let numIndices = model.count();

		let longitud = toBeResolve.length;
		//if (toBeResolve.length === 0) {
			if (longitud === 0) {
			log('No hay nada mas que preguntar. ');
			log('Fin del juego. ACIERTOS: '+ score);
			log(score,'magenta');
			//log(score,'magenta');
			rl.prompt();
		} else{
			
			let id = Math.trunc(Math.random()*(longitud));
			//log('id: ' + id);
			//log('quizzes1: ' + quizzes.length);
			let quiz = toBeResolve[id];


				rl.question(colorize(quiz.question + "?   ", 'red'), resp => {
					if(String(resp.trim().toLowerCase()) === String(quiz.answer.toLowerCase()) ) {
							score = score + 1;
							log ("CORRECTO - llevas " + score + " aciertos.");
							toBeResolve.splice(id, 1);
							
							playOne();
							rl.prompt();
							
						}
						 	else { log ("INCORRECTO.");
						 	log ("Fin del juego. Aciertos:" + score  );
						 	log(score,'magenta');
						 	//log(score,'magenta');
						 	rl.prompt();
						 }
						//rl.prompt();

					});
				};
				rl.prompt();
			};

		playOne(); 

};

exports.deleteCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog('Falta el parametro id. ');
	} else {
		try {
			model.deleteByIndex(id);
			
		} catch (error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.editCmd = (rl, id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parametro id. `);
		rl.prompt();
	} else {
		try {

			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

			rl.question(colorize(' Introduzca una pregunta: ', 'red'), question =>{

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

				rl.question(colorize(' Introduzca la respuesta: ', 'red'), answer =>{

					model.update(id, question, answer);
					log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
					rl.prompt();
			});
		});
		
		} catch (error) {
			errorlog(error.message);
			rl.prompt();
		}
	}

	
};

exports.creditsCmd = rl => {
	log('Autor de la práctica: PAULA OTERO. ', 'green');
	rl.prompt();
};
