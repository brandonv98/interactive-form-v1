"use strict";
window.onload = () => { // On load select input form. === first;
	const input = nodes.form.querySelector('input'); // Get first input element within form.
	const firstDiv = nodes.fieldset[3].querySelector('DIV').style.display = 'none'; // Hide the payment div
	input.focus(); // Focus input.
	input.select(); // Then select Element.
};
const nodeConfig = (f) => { // Traverse the DOM to select needed nodes.
	const form = document.querySelector('FORM');
	const fieldsetFirst = form.firstElementChild;
	const fieldsets = form.querySelectorAll('FIELDSET');
	const jobRole = fieldsetFirst.lastElementChild;
	const button = document.querySelector('BUTTON[TYPE="SUBMIT"]');
	const allInput = document.querySelectorAll('INPUT[id]');
	const exportNodes = {
		form,
		fieldsetFirst,
		jobRole,
		fieldset: fieldsets,
		getParent: null,
		findParent(node, parentValue) {
			this.getParent = node.parentNode;
			let isSeekedParent = node.parentNode.tagName === parentValue;
			if (isSeekedParent) {
				return this.getParent;
			} else {
				this.findParent(node.parentNode, parentValue);
			}
		},
		total: 0,
		button,
		allInput,
		url: null
	};
	return exportNodes;
};
let nodes = nodeConfig(); // Save slected nodes.

let someState = [];
// const select = nodes.fieldset[3].querySelector('SELECT');
const disabledColorShirts = (selectNode) => { // Param = the select node from { nodes.fieldset[2].color section }.
	const newOptionNode = document.createElement('OPTION'); // Create new option node.
	selectNode.append(newOptionNode); // append new option node.
	newOptionNode.innerHTML = 'Select a theme first..'; // Add description.
	newOptionNode.setAttribute('selected', true); // Set option node to show first.
	selectNode.setAttribute('disabled', true); // Disable color box.
};
// ============================================================================
// ----------------		Event Listeners	& Start State 	-------------------------
// ============================================================================
const onLoad = (node) => {
	nodes.fieldset[1].querySelector('SELECT[id="design"]').addEventListener("change", handleShirtSelect, true);
	nodes.fieldset[2].addEventListener("change", handleActivities, true);
	nodes.fieldset[3].addEventListener("change", handleCcSelection, true);
	nodes.jobRole.addEventListener("change", jobRoleSelection, true);
	nodes.button.addEventListener('click', onSubmit, true);
	disabledColorShirts(nodes.fieldset[1].lastElementChild.lastElementChild);
	handleRequiredFields(nodes.allInput, 3);
}

const handleRequiredFields = (inputs, num) => {
	for (var i = 0; i < inputs.length - num; i++) {
		inputs[i].setAttribute('required', true);
	}
}
// ===========================================
// ---------		Section 1	 	------------------
// ===========================================
const elementsToCreate = (appendLocation) => { // Create and append new input if other is selected.
	let newDiv = document.createElement('DIV');
	let HTML = `
  <label for="other-title">Other Job Role</label>
    <input type="text" id="other-title" name="user_job" placeholder="Your Job Role">`;
	appendLocation.appendChild(newDiv);
	newDiv.innerHTML = `${HTML}`;
};
const jobRoleSelection = (e) => {
	let optionOther = e.target.value === 'other';
	let appendedDiv = nodes.fieldsetFirst.lastElementChild;
	if (optionOther) {
		elementsToCreate(nodes.fieldsetFirst);
	} else if (appendedDiv.tagName === 'DIV') {
		appendedDiv.remove(); // Remove old Div
	}
};
// ===========================================
// ---------		Section 2	 	------------------
// ===========================================
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
	}
};
const handleShirtSelect = (e) => {
	let shirt = e.target.value; // Users desired shirt.
	const selected = nodes.fieldset[1].lastElementChild.lastElementChild; // Select Node.
	const options = nodes.fieldset[1].lastElementChild.lastElementChild.querySelectorAll('OPTION'); // Option Nodes.
	if (selected.disabled) {
		options[options.length - 1].remove();
		selected.removeAttribute('disabled');
		options[0].setAttribute('selected', true);
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
const findCrossTimes = (labels, Usertarget) => { /// Yeah, IDFK.....
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
				disableTimes(labels[i], Usertarget);
			}
		}
	}
};

const disableTimes = (label, Usertarget) => {
	let isChecked = Usertarget.checked;
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
		Usertarget.parentNode.setAttribute('style', 'opacity: 1;');
		Usertarget.removeAttribute('disabled');
	} catch (e) {
		console.error('This a problem...', 'Problem finding users traget node', e);
	}
};
const handleActivities = (e) => {
	const checkBox = e.target;
	let clickedBtnLabel = checkBox.parentNode.textContent;
	let clickedBtnLabelFind = clickedBtnLabel.indexOf('$');
	const shopCost = parseInt(clickedBtnLabel.slice(clickedBtnLabelFind + 1));
	const dollarSign = clickedBtnLabel.charAt(clickedBtnLabelFind);
	let parent = nodes.findParent(checkBox, 'FIELDSET');
	parent = nodes.getParent;
	const isDiv = parent.querySelector('DIV') === null;
	if (isDiv) {
		const newDiv = document.createElement('DIV');
		parent.append(newDiv);
		newDiv.setAttribute('class', 'total');
	} {
		(checkBox.checked) ? nodes.total += shopCost: nodes.total -= shopCost;
	};
	let HTML = `<legend>Your Total:</legend>
							<label for="total">${dollarSign} ${nodes.total}</label> `;
	parent.lastElementChild.innerHTML = `${HTML}`;
	findCrossTimes(parent, checkBox);
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

const onSubmit = (e) => {
	const url = nodes.url;

	if (url === undefined) {
		handleRequiredFields(nodes.allInput, 0);
	} else {
		// const isCC = url !== null;
		// isCC ? window.open(nodes.url, '_blank') : alert('select a payment type.');
	}

};



onLoad();