function init(){

	var stage = new createjs.Stage("canvas");

	var game = {

		deck: [],
		buttons: [
			new Button('Hit', '#fff', 100, 100, () => player.hit()),
			new Button('Stand', '#fff', 200, 100, () => l('stand'))
		],
		buttonContainer: false,

		start: function(){
			stage.enableMouseOver(10);
			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
			this.buildDeck();
			this.distributeCard('player');
			this.distributeCard('player');
			this.distributeCard('bank');
			this.distributeCard('bank', true);
			this.addButtons();
		},

		buildDeck: function(){
			for(var suit of suits){
				for(var i=2; i<11; i++)
					this.deck.push(new Card(suit, i));
				
				for(var v of ['J', 'Q', 'K', 'A'])
					this.deck.push(new Card(suit, v));
			}
		},

		deckValue: function(){

		},

		distributeCard(to, hided = false){
			var index = rand(0, this.deck.length - 1);
			var card = this.deck[index];
			if(hided) card.hided = true;

			if(to == 'bank')
				bank.deck.push(card)
			else if(to == 'player')
				player.deck.push(card)

			this.deck.splice(index, 1);
			this.displayCard();
		},

		displayCard: function(){
			if(!bank.cardsContainer){
				bank.cardsContainer = new createjs.Container();
				bank.cardsContainer.y = -100;
				stage.addChild(bank.cardsContainer);
			}
			if(!player.cardsContainer){
				player.cardsContainer = new createjs.Container();
				player.cardsContainer.y = 300;
				stage.addChild(player.cardsContainer);
			}

			bank.cardsContainer.x = 500; //do this better later
			player.cardsContainer.x = 500; //do this better later

			bank.deck.forEach(function(card, index){
				var cardSrc = card.hided ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var bankCard = new createjs.Bitmap(cardSrc);
				bankCard.x = 50 * index;
				bankCard.y = 100;
				bank.cardsContainer.addChild(bankCard);
				bank.cardsContainer.x -= 20;
			})

			player.deck.forEach(function(card, index){
				var cardSrc = card.hided ? imgs.cards.path + imgs.cards.back.red + '.' + imgs.cards.ext : imgs.cards.get(card.suit, card.value);
				var playerCard = new createjs.Bitmap(cardSrc);
				playerCard.x = 50 * index;
				playerCard.y = 100;
				player.cardsContainer.addChild(playerCard);
				player.cardsContainer.x -= 20;
			})

		},

		addButtons: function(){
			this.buttonContainer = new createjs.Container();
			this.buttonContainer.x = -70;
			this.buttonContainer.y = 500;
			stage.addChild(this.buttonContainer);

			this.buttons.forEach(function(b){
				var button = new createjs.Text(b.text, '30px Arial', b.color);
				button.x = b.x;
				button.y = b.y;
				var hit = new createjs.Shape();
				hit.graphics.beginFill('#000').drawRect(0, 0, button.getMeasuredWidth(), button.getMeasuredHeight());
				button.hitArea = hit;
				button.alpha = 0.7;
				button.on('mouseover', function(event){
					button.alpha = 1;
					button.cursor = 'Pointer';
				});
				button.on('mouseout', event => button.alpha = 0.7);
				button.addEventListener('click', b.onclick);
				game.buttonContainer.addChild(button);
			})
		},

	};

	var bank = {

		deck: [],
		cardsContainer: false,

	};

	var player = {

		deck: [],
		cardsContainer: false,
		funds: 1000,

		hit: function(){
			l('hit');
			game.distributeCard('player');
		},

	};

	function tick(){
		stage.update();
	}

	game.start();

}
