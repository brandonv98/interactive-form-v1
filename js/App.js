/*==========================================================================================================
//^		To understand all syntax used in this project please view README.md section one. // Comeing soon....
//^		--------------------------------------------------------------------------------
//^		1. Quick tips => mkNode(); = nodes.mkNode(tagName, ParentNode, 'optional:{innerHTML}');
//^		2. findParent(); => nodes.findParent(	element, 'tagName' ); Tag name is passed to the parent you are seeking to find.
//^		3.
==========================================================================================================*/
"use strict";
const sectionsHide = () => {
	const ccDiv = nodes.fieldset[3].querySelector('DIV'); // Select CC Div.
	ccDiv.style.display = 'none' // Hide the payment divs
	const payPal = ccDiv.nextElementSibling;
	payPal.style.display = 'none'; // Hide the payment divs
	const bitCoin = payPal.nextElementSibling.style.display = 'none'; // Hide the payment divs
	const basicInfo = document.querySelectorAll('INPUT');

	const otherJobHide = nodes.fieldset[0].querySelector('#other-title');
	otherJobHide.previousElementSibling.style.display = 'none';
	otherJobHide.style.display = 'none';
};

window.onload = () => { // On load select input form. === first;
	const input = nodes.form.querySelector('input'); // Get first input element within form.
	input.focus(); // Focus input.
	input.select(); // Then select Element.
};
const nodeConfig = (f) => { // Traverse the DOM to select needed nodes.
	const form = document.querySelector('FORM');
	const fieldsets = form.querySelectorAll('FIELDSET');
	const button = document.querySelector('BUTTON[TYPE="SUBMIT"]');
	const allInput = document.querySelectorAll('INPUT[id]');
	const exportNodes = {
		form,
		fieldset: fieldsets,
		getParent: null,
		findParent(node, seekingParent) {
			this.getParent = node.parentNode;
			let isSeekedParent = node.parentNode.tagName === seekingParent; {
				return (isSeekedParent ? this.getParent : this.findParent(node.parentNode, seekingParent));
			}
		},
		findChild(node, seekingChild) {
			this.node = node.nextSibling;
			let isSeekedChild = node.nextSibling.tagName === seekingChild; {
				return (isSeekedChild ? this.node : this.findChild(node.nextSibling, seekingChild));
			}
		},
		mkNode(NODE, location, HTML) {
			const newNode = document.createElement(NODE); // Create new DOM node.
			location.append(newNode); // append new DOM node.
			(HTML) ? newNode.innerHTML = HTML: null; // If HTML is passed utilize it, else set to null.
			return newNode;
		},
		rmNode(NODE, parentLocation = undefined) { // Remove Node
			const parent = this.findParent(NODE, parentLocation); // If not found find it.
			(NODE) ? NODE.remove(): null; // Remove node
		},
		typeError(NODE, errorColor = 'red') {
			this.NODE = NODE;
			this.errorColor = errorColor;
			return NODE.setAttribute('style', `border: 3px solid ${errorColor}; border-radius: 8px;`);
		},
		isValue(inputValue) {
			this.inputValue = inputValue;
			const isValid = inputValue.value.length >= 2;
			return (isValid ? true : false);
		},
		validateEmail(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		},
		validateName(name) {
			const re = /^[A-Za-z\s]+$/;
			return re.test(String(name).toLowerCase());
		},
		notifyUser(props) {
			const HTML = `<span class="${props.class}">${props.name}</span>`;
			return `${props.before} ${HTML}`;
		},
		customError(inputNode, message = 'Error !') {
			let check;
			if (inputNode.required) {
				const HTML = `<span class="error">${message}</span>`;
				this.mkNode('DIV', inputNode.previousElementSibling || inputNode.parentNode, HTML);
				if (inputNode.parentNode.querySelectorAll('LABEL').length > 1) {
					const check = inputNode.parentNode.querySelectorAll('LABEL');
					console.log(check);
					for (let i = 0; i < check.length; i++) {
						if (check[i].children.length > 1) {
							if (check[i].children[0].tagName === 'DIV') {
								this.rmNode(check[i].children[0]);
							}
						}
					}
				}
			} else {
				const rmError = inputNode.parentNode.querySelector('SPAN[class="error"]').parentNode;
				this.rmNode(rmError);
			}
		},
		total: 0,
		button,
		allInput,
		url: null,
		attempts: 0
	};
	return exportNodes;
};
const nodes = nodeConfig(); // Save our config nodes & methods.
const errorTypes = (opacity = 0.5) => {
	const errorTypes = {
		success: `rgba(144, 238, 144, ${opacity})`,
		error: `rgba(255, 0, 0, ${opacity})`,
		warning: `rgba(255, 255, 0, ${opacity})`
	};
	return errorTypes;
}
// ============================================================================
// ----------------		Event Listeners	& Start State 	-------------------------
// ============================================================================
const onLoad = (node) => { // Create on load.
	nodes.fieldset[0].addEventListener("change", jobRoleSelection, true); // Job Role other.
	nodes.fieldset[0].addEventListener("keypress", emailCheck, true); // Job Role other.
	nodes.fieldset[1].querySelector('SELECT[id="design"]').addEventListener("change", handleShirtSelect, true); // T-Shirt Info section.
	nodes.fieldset[2].addEventListener("change", handleActivities, true); // Activities Section.
	nodes.fieldset[3].addEventListener("change", handleCcSelection, true); // Payment Section.
	nodes.button.addEventListener('click', onSubmit, true); // Submit button.
	disabledColorShirts(nodes.fieldset[1].lastElementChild.lastElementChild); // Disabled colors section on load.
	nodes.button.type = 'button';
	sectionsHide();
}
const emailCheck = (e) => {
	if (e.target.type === 'email') {
		if (nodes.validateEmail(e.target.value)) {
			nodes.typeError(e.target, errorTypes(.5).success);
			e.target.removeAttribute('required');
		} else {
			nodes.typeError(e.target, errorTypes(.5).error);
		}
	}
	if (e.target.type === 'text') {
		if (nodes.validateName(e.target.value)) {
			nodes.typeError(e.target, errorTypes(.5).success);
			e.target.removeAttribute('required');
		} else {
			nodes.typeError(e.target, errorTypes(.5).error);
		}
	}
};
const handleRequiredFields = (inputs, num = null, isTrue = false) => { // Add and remove required fields
	for (var i = 0; i < inputs.length - num; i++) {
		if (nodes.isValue(inputs[i])) {
			inputs[i].removeAttribute('required', true);
			nodes.typeError(inputs[i], errorTypes(.5).success);
		} else {
			inputs[i].setAttribute('required', true);
			nodes.typeError(inputs[i], errorTypes(.5).error);
		}
		if (inputs[i].type === 'checkbox' && isTrue) {
			inputs[i].setAttribute('required', true);
		} else if (inputs[i].type === 'checkbox') {
			inputs[i].removeAttribute('required');
		}
	}
}
// =========================================================
// ---------		Section 1	 	@Basic Info 	------------------
// =========================================================
const otherJobRoleField = (parentNode) => { // Create and append new input if other is selected.
	const HTML = `
	<label for="other-title">Other Job Role</label>
	<input type="text" id="other-title" name="user_job" placeholder="Your Job Role" required>`;
	nodes.mkNode('DIV', parentNode, `${HTML}`);
};
const jobRoleSelection = (e) => {
	const target = e.target || e;
	let optionOther = target.value === 'other';
	let appendedDiv = nodes.fieldset[0].lastElementChild;

	if (target.tagName === 'SELECT') { // Double check we are only fireing on SELECT NODES values.
		if (optionOther) {
			otherJobRoleField(nodes.fieldset[0]); // Pass 1st fieldset DOM node.
		} else if (appendedDiv.tagName === 'DIV') {
			appendedDiv.remove(); // Remove old Div
		}
	}
	if (target.type === 'email') {
		if (nodes.validateEmail(target.value)) {
			nodes.typeError(target, errorTypes(.5).success);
			target.removeAttribute('required');
		} else {
			nodes.typeError(target, errorTypes(.5).error);
			target.setAttribute('required', true);
		}
	}
	if (target.type === 'text') {
		if (nodes.validateName(target.value)) {
			nodes.typeError(target, errorTypes(.5).success);
			target.removeAttribute('required');
		} else {
			nodes.typeError(target, errorTypes(.5).error);
			target.setAttribute('required', true);
		}
	}
};
// ===========================================================
// ---------		Section 2	 	@T-Shirt Info		------------------
// ===========================================================
const disabledColorShirts = (parentNode) => { // Param = the select node from { nodes.fieldset[1].color section }.
	const parentDiv = nodes.findParent(parentNode, 'DIV'); // Find Parent Div.
	parentDiv.style.visibility = 'hidden'; // Hide Parent Div.
};
const handleColors = (colors, brand) => {
	for (let i = 0; i < colors.length; i++) {
		if (brand === 'js puns') {
			if (colors[i].textContent.indexOf('I') > 1) {
				colors[i].hidden = true;
				colors[i].removeAttribute('selected', true);
			} else {
				colors[i].hidden = false;
				colors[i].setAttribute('selected', true);
			}
		} else if (brand === 'heart js') {
			if (colors[i].textContent.indexOf('Puns') > 1) {
				colors[i].hidden = true;
				colors[i].removeAttribute('selected', true);
			} else {
				colors[i].hidden = false;
				colors[i].setAttribute('selected', true);
			}
		}
	} /// End for loop.
};
const handleShirtSelect = (e) => {
	let shirt = e.target.value; // Users desired shirt.
	const selected = nodes.fieldset[1].lastElementChild.lastElementChild; // Select Node.
	const options = nodes.fieldset[1].lastElementChild.lastElementChild.querySelectorAll('OPTION'); // Option Nodes.
	const parentDiv = nodes.findParent(selected, 'DIV'); // Find Parent Div.
	if (parentDiv.style.visibility === 'hidden') {
		parentDiv.removeAttribute('style', true);
	}
	if (shirt === 'heart js') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else if (shirt === 'js puns') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else {
		disabledColorShirts(selected);
	}
};
// =====================================================================
// ---------		Section 3	 	@Register for Activities 	------------------
// =====================================================================
const findCrossTimes = (labels, Usertarget) => { /// Find times that collide.
	labels = labels.children;
	const targetTextContext = Usertarget.parentNode.textContent;
	const findTime = targetTextContext.indexOf('— ');
	const targetTime = targetTextContext.slice(findTime, -11);
	for (let i = 0; i < labels.length; i++) {
		const labelTextContent = labels[i].textContent;
		let labelsFindTime = labelTextContent.indexOf('— ');
		let lablesTime = labelTextContent.slice(labelsFindTime, -11);
		if (lablesTime.includes(targetTime)) {
			if (targetTime.length > 0) {
				disableTimes(labels[i], Usertarget); // If times do collide, disable them.
			}
		}
	}
};
const disableTimes = (label, Usertarget) => { // Disable/ enable times.
	const isChecked = Usertarget.checked;
	if (!isChecked) {
		// console.log(Usertarget, label, '!Checked is fired', !isChecked); // Added for training wheels.
		label.setAttribute('style', 'opacity: 1;');
		label.firstElementChild.removeAttribute('disabled');
	} else if (isChecked) {
		// console.log(Usertarget, label, 'isCheck fired', isChecked); // Added for training wheels.
		label.setAttribute('style', 'opacity: 0.4;');
		label.firstElementChild.setAttribute('disabled', true);
	}
	Usertarget.parentNode.setAttribute('style', 'opacity: 1;');
	Usertarget.removeAttribute('disabled');
	try {
		Usertarget.parentNode.setAttribute('style', 'opacity: 1;'); // Make sure user's target does not get disabled.
		Usertarget.removeAttribute('disabled');
	} catch (e) {
		console.error('This a problem...', 'Problem finding users traget node', e);
	}
};
const handleActivities = (e) => {
	const userTarget = e.target;
	const clickedBtnLabel = userTarget.parentNode.textContent;
	const clickedBtnLabelFind = clickedBtnLabel.indexOf('$');
	const shopCost = parseInt(clickedBtnLabel.slice(clickedBtnLabelFind + 1));
	const dollarSign = clickedBtnLabel.charAt(clickedBtnLabelFind);
	let parent = nodes.findParent(userTarget, 'FIELDSET'); // Find parent === FIELDSET
	parent = nodes.getParent;
	let isDiv = parent.querySelector('DIV') === null;
	if (isDiv) {
		const newDiv = nodes.mkNode('DIV', parent); // Make new div node.
		newDiv.setAttribute('class', 'total');
	} {
		(userTarget.checked) ? nodes.total += shopCost: nodes.total -= shopCost;
	};
	let HTML = `<legend>Your Total:</legend>
							<label for="total">${dollarSign} ${nodes.total}</label> `;
	parent.lastElementChild.innerHTML = `${HTML}`; // Append total's
	findCrossTimes(parent, userTarget); // Check cross times conflict.
};
// =============================================================
// ---------		Section 4	 	@ Payment Info		------------------
// =============================================================
const handleCcSelection = (e) => {

	// console.log(e.target);
	const target = e.target || e;

	const paymentDivs = nodes.fieldset[3].querySelectorAll('DIV');
	const select = nodes.fieldset[3].querySelector('SELECT');
	const isCC = select.value === 'credit card'; // CreditCard
	const isPP = select.value === 'paypal'; // PayPal
	const isBC = select.value === 'bitcoin'; // Bitcoin
	const toCheck = {
		isCC,
		isPP,
		isBC
	};

	if (target.value === 'select_method') {
		nodes.typeError(target, errorTypes(.5).error);
		// nodes.button.type = 'button';
	} else {
		nodes.typeError(target, errorTypes(0).success);
	}
	handleSelect(toCheck, paymentDivs);
};
const handleSelect = (isTruthy, div) => {
	div[0].style.display = 'none';
	div[4].style.display = 'none';
	div[5].style.display = 'none';

	if (isTruthy.isCC) {
		div[0].style.display = 'block';
		nodes.url = undefined;

		div[1].querySelector('INPUT').setAttribute('maxlength', '16');
		div[1].querySelector('INPUT').setAttribute('minlength', '13');

		div[2].querySelector('INPUT').setAttribute('maxlength', '5');
		div[2].querySelector('INPUT').setAttribute('minlength', '5');

		div[3].querySelector('INPUT').setAttribute('maxlength', '3');
		div[3].querySelector('INPUT').setAttribute('minlength', '3');

		for (var i = 1; i < div.length - 2; i++) {
			if (parseInt(div[i].querySelector('INPUT').value)) {
				nodes.typeError(div[i].querySelector('INPUT'), errorTypes(.5).success);
				if (div[i].querySelector('INPUT').value.length >= div[i].querySelector('INPUT').minLength) {
					nodes.typeError(div[i].querySelector('INPUT'), errorTypes(.5).success);
					// console.log(div[i].querySelector('INPUT').value.length, div[i].querySelector('INPUT').minLength, div[i].querySelector('INPUT').maxLength);
				} else {
					nodes.typeError(div[i].querySelector('INPUT'), errorTypes(.5).error);
				}
			} else {
				div[i].querySelector('INPUT').value = '';
			}
		}
	} else if (isTruthy.isPP) {
		const url = 'https://www.paypal.com/us/home';
		div[4].style.display = 'block';
		nodes.url = url;
	} else
	if (isTruthy.isBC) {
		const url = 'https://bitcoin.org/en/';
		div[5].style.display = 'block';
		nodes.url = url;
	}
};
// ====================================================================
// ---------		Section 5	 @ Payment Info > Button	-------------------
// ====================================================================
const onSubmit = (e) => {
	const url = nodes.url;
	const paymentDivs = nodes.fieldset[3].querySelectorAll('DIV');
	const basicInfo = nodes.fieldset[0].querySelectorAll('INPUT');
	const activities = nodes.fieldset[2].querySelectorAll('INPUT');
	const paymentType = nodes.fieldset[3].querySelector('#payment');
	nodes.attempts++;

	if (nodes.total > 0) { // Activies section check
		handleRequiredFields(activities, null); // Remove required fields.
		activities[1].parentNode.parentNode.firstElementChild.innerHTML = 'Register for Activities ';
	} else {
		handleRequiredFields(activities, null, true); // Add required fields.
		activities[1].parentNode.parentNode.firstElementChild.innerHTML = nodes.notifyUser({
			name: '&#9747; ERROR ! Please select at least one.',
			before: 'Register for Activities',
			class: 'error'
		});
	}
	if (paymentType.value === 'select_method') {
		nodes.typeError(paymentType, errorTypes(.5).error);
		paymentType.setAttribute('required', true);
	} else {
		nodes.typeError(paymentType, errorTypes(0).success);
		paymentType.removeAttribute('required', true);
	}
	if (url === undefined) {
		handleRequiredFields(nodes.fieldset[3].querySelectorAll('INPUT'), 0);
	} else {
		const isCC = url !== null;
		isCC ? console.log('Nope') : nodes.typeError(paymentType, errorTypes(.5).error);
	}
	const errors = document.querySelectorAll('[required]');
	if (errors.length === 0) { // If all is ready, then submit.
		nodes.form.action = 'index.html';
		nodes.form.submit(); //form submission
	} else {
		handleCcSelection(paymentType);
		jobRoleSelection(basicInfo[0]);
		jobRoleSelection(basicInfo[1]);
		nodes.customError(basicInfo[0], '&#9747; ERROR ! Please choose a better name.');
		nodes.customError(basicInfo[1], '&#9747; ERROR ! please check your email formate');
	}
};

onLoad();
