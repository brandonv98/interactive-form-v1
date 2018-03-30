/*==========================================================================================================
//^		To understand all syntax used in this project please view README.md section one.
//^		--------------------------------------------------------------------------------
//^		1. Quick tips => mkNode(); = nodes.mkNode(tagName, ParentNode, 'optional:{innerHTML}');
//^		2. findParent(); => nodes.findParent(	element, 'tagName' ); Tag name is passed to the parent you are seeking to find.
//^				Selecting parent node use (	nodes.getParent	). value is === to let values.
//^ 	3.
==========================================================================================================*/
"use strict";

window.onload = () => { // On load select input form. === first;
	const input = nodes.form.querySelector('input'); // Get first input element within form.
	const firstDiv = nodes.fieldset[3].querySelector('DIV').style.display = 'none'; // Hide the payment div
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
		mkNode(NODE, location, HTML) {
			const newNode = document.createElement(NODE); // Create new DOM node.
			location.append(newNode); // append new DOM node.
			(HTML) ? newNode.innerHTML = HTML: null; // If HTML is passed utilize it, else set to null.
			return newNode;
		},
		typeError(NODE, errorColor = 'red') {
			this.NODE = NODE;
			return NODE.setAttribute('style', `border: 2px solid ${errorColor}`);
		},
		isValue(inputValue) {
			this.inputValue = inputValue;
			const isValid = inputValue.value.length >= 2;
			return (isValid ? true : false);
		},
		total: 0,
		button,
		allInput,
		url: null
	};
	return exportNodes;
};
const nodes = nodeConfig(); // Save our config nodes & methods.
const errorTypes = {
	success: 'lightgreen',
	error: 'red',
	warning: 'yellow'
};
// ============================================================================
// ----------------		Event Listeners	& Start State 	-------------------------
// ============================================================================
const onLoad = (node) => { // Create on load.
	nodes.fieldset[0].addEventListener("change", jobRoleSelection, true); // Job Role other.
	nodes.fieldset[1].querySelector('SELECT[id="design"]').addEventListener("change", handleShirtSelect, true); // T-Shirt Info section.
	nodes.fieldset[2].addEventListener("change", handleActivities, true); // Activities Section.
	nodes.fieldset[3].addEventListener("change", handleCcSelection, true); // Payment Section.
	nodes.button.addEventListener('click', onSubmit, true); // Submit button.
	disabledColorShirts(nodes.fieldset[1].lastElementChild.lastElementChild); // Disabled colors section on load.
}

const handleRequiredFields = (inputs, num = null, isTrue) => { // Mainly for CC payments.
	for (var i = 0; i < inputs.length - num; i++) {
		if (nodes.isValue(inputs[i])) {
			inputs[i].removeAttribute('required', true);
			nodes.typeError(inputs[i], errorTypes.success);
		} else {
			inputs[i].setAttribute('required', true);
			nodes.typeError(inputs[i]);
		}
	}
}
// =========================================================
// ---------		Section 1	 	@Basic Info 	------------------
// =========================================================
const otherJobRoleField = (parentNode) => { // Create and append new input if other is selected.
	const HTML = `
	<label for="other-title">Other Job Role</label>
	<input type="text" id="other-title" name="user_job" placeholder="Your Job Role">`;
	nodes.mkNode('DIV', parentNode, `${HTML}`);
};
const jobRoleSelection = (e) => {
	let optionOther = e.target.value === 'other';
	let appendedDiv = nodes.fieldset[0].lastElementChild;
	if (optionOther) {
		otherJobRoleField(nodes.fieldset[0]); // Pass 1st fieldset DOM node.
	} else if (appendedDiv.tagName === 'DIV') {
		appendedDiv.remove(); // Remove old Div
	}
};
// ===========================================================
// ---------		Section 2	 	@T-Shirt Info		------------------
// ===========================================================
const disabledColorShirts = (parentNode) => { // Param = the select node from { nodes.fieldset[1].color section }.
	const HTML = 'Select a theme first..'; // Add description.
	const option = nodes.mkNode('OPTION', parentNode, HTML);
	const parentDiv = nodes.findParent(parentNode, 'DIV'); // Find Parent Div.
	parentDiv.style.visibility = 'hidden'; // Hide Parent Div.
	// option.setAttribute('selected', true); // Set option node to show first.
	parentNode.setAttribute('disabled', true); // Disable color box.
};
const handleColors = (colors, brand) => {
	for (let i = 0; i < colors.length; i++) {
		if (brand === 'js puns') {
			if (colors[i].textContent.indexOf('I') > 1) {
				colors[i].hidden = true;
			} else {
				colors[i].hidden = false;
			}
		} else if (brand === 'heart js') {
			if (colors[i].textContent.indexOf('Puns') > 1) {
				colors[i].hidden = true;
			} else {
				colors[i].hidden = false;
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

		// NOTE: NEEDS TO BE FIXED!!

		options[options.length - 1].remove();
		const parentDiv = nodes.findParent(selected, 'DIV'); // Find Parent Div.
		parentDiv.removeAttribute('style', true);
		// console.log(parentDiv);
		selected.removeAttribute('disabled');
		// options[0].setAttribute('selected', true);
	} else if (shirt === 'heart js') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else if (shirt === 'js puns') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else {
		disabledColorShirts(selected);
	}
};
// ===========================================
// ---------		Section 3	 	------------------
// ===========================================
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
		// console.log(Usertarget, label, '!Checked is fired', !isChecked); // Added for people who want/need training wheels.
		label.setAttribute('style', 'opacity: 1;');
		label.firstElementChild.removeAttribute('disabled');
	} else if (isChecked) {
		// console.log(Usertarget, label, 'isCheck fired', isChecked); // Added for people who want/need training wheels.
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
// ===========================================
// ---------		Section 4	 	------------------
// ===========================================
const handleCcSelection = (e) => {
	const firstDiv = nodes.fieldset[3].querySelector('DIV');
	const select = nodes.fieldset[3].querySelector('SELECT');
	const isCC = select.value === 'credit card'; // CreditCard
	const isPP = select.value === 'paypal'; // PayPal
	const isBC = select.value === 'bitcoin'; // Bitcoin
	const toCheck = {
		isCC,
		isPP,
		isBC
	};
	handleSelect(toCheck, firstDiv);
};
// ===========================================
// ---------		Section 5	 	------------------
// ===========================================
const handleSelect = (isTruthy, div) => {
	if (isTruthy.isCC) {
		div.style.display = 'block';
		nodes.url = undefined;
	} else if (isTruthy.isPP) {
		const url = 'https://www.paypal.com/us/home';
		nodes.url = url;
	} else if (isTruthy.isBC) {
		const url = 'https://bitcoin.org/en/';
		nodes.url = url;
	} else {
		div.style.display = 'none';
	}
};
// const basicInfo = nodes.fieldset[0].querySelectorAll('INPUT');
// handleRequiredFields(basicInfo, null, false); // Add required fields.
const onSubmit = (e) => {
	e.preventDefault();
	const url = nodes.url;

	const basicInfo = nodes.fieldset[0].querySelectorAll('INPUT');
	const activities = nodes.fieldset[2].querySelectorAll('INPUT');

	handleRequiredFields(basicInfo, null, false); // Add required fields.

	if (nodes.total > 0) {
		handleRequiredFields(activities, null, true); // Remove required fields.
	} else {
		handleRequiredFields(activities, null, false); // Add required fields.
		console.log('NOOO');
	}


	if (url === undefined) {
		handleRequiredFields(nodes.allInput, 0);
	}
	// else {
	// const isCC = url !== null;
	// isCC ? window.open(nodes.url, '_blank') : alert('select a payment type.');
	// }

};



onLoad();