/**
 * @namespace ToggleDisposition
 */
class ToggleDisposition {
	/** 
	 * cache of module settings
	 */ 
	static _cachedEnableHudButton = true;

	static buttonEventHandler(event, token) {
		let target = $(event.currentTarget).find('.dispositions');

		target.css('top', event.currentTarget.offsetTop - 53);
		target.css('visibility', 'visible');
	}

	static dispositionChangeEventHandler(event, token, disposition) {
		let eventTarget = $(event.currentTarget.parentElement);
		eventTarget.css('visibility', 'hidden');
		token.update({disposition: disposition});
		eventTarget.closest('.toggle-disposition').children('i').removeClass().addClass('fas').addClass(this.getIconForDisposition(disposition));
		event.stopPropagation();
	}

	static getIconForDisposition(disposition) {
		switch(disposition) {
			case 1:
				return 'fa-face-smile';
			case 0:
				return 'fa-face-meh';
			default:
				return 'fa-face-angry';
		}
	}

	static getTooltipForDisposition(disposition) {
		switch(disposition) {
			case 1:
				return 'toggle-token-disposition.disposition.friendly';
			case 0:
				return 'toggle-token-disposition.disposition.neutral';
			default:
				return 'toggle-token-disposition.disposition.hostile';
		}
	}

	static getTokenActor(token) {
		return game.actors.get(token.actorId); 
	}

	static createDispositionButtons(token) {
		let buttons = document.createElement("div");
		buttons.classList.add("dispositions");

		buttons.append(this.createDispositionChangeButton(CONST.TOKEN_DISPOSITIONS.FRIENDLY, token));
		buttons.append(this.createDispositionChangeButton(CONST.TOKEN_DISPOSITIONS.NEUTRAL, token));
		buttons.append(this.createDispositionChangeButton(CONST.TOKEN_DISPOSITIONS.HOSTILE, token));

		return buttons;
	}

	static createDispositionChangeButton(disposition, token) {
		let button = this.createButton(disposition);

		$(button).click((event) =>
			this.dispositionChangeEventHandler(event, token, disposition)
		)
		.contextmenu((event) =>
			this.dispositionChangeEventHandler(event, token, disposition)
		);

		return button;
	}

	static createButton(disposition, overrideTooltipKey) {
		let button = document.createElement("div");

		button.classList.add("control-icon");
		button.classList.add("toggle-disposition");
		button.innerHTML = `<i class="fas ${this.getIconForDisposition(disposition)}"></i>`;
		button.title = game.i18n.localize(overrideTooltipKey ? overrideTooltipKey : this.getTooltipForDisposition(disposition));

		return button;
	}

	static prepTokenHUD(hud, html, token) {
		// check setting, early out if hud button is disabled
		if(!this._cachedEnableHudButton) {
			return;
		}

		const tokenButton = this.createButton(hud.object.document.disposition, "toggle-token-disposition.tooltiptext");
		tokenButton.append(this.createDispositionButtons(hud.object.document));

		$(tokenButton)
			.click((event) =>
				this.buttonEventHandler(event, hud.object.document)
			)
			.contextmenu((event) =>
				this.buttonEventHandler(event, hud.object.document)
			);

		html.find("div.left").append(tokenButton);
	}
}

Hooks.once("init", () => {});

Hooks.on("renderTokenHUD", (...args) => ToggleDisposition.prepTokenHUD(...args));
