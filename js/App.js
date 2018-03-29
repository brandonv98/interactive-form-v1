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
	const allInput = document.querySelectorAll('INPUT');
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
		allInput
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
const findCrossTimes = (checkTimes, btnClicked) => {
	checkTimes = checkTimes.children;
	const storeState = [];
	let clickedBtnLabel = btnClicked.parentNode.textContent;
	let clickedBtnLabelFind = clickedBtnLabel.indexOf('— ');
	let clickedBtnLabelFindChar = clickedBtnLabel.charAt(clickedBtnLabelFind);
	const timeFromClick = clickedBtnLabel.slice(clickedBtnLabelFind, -11);

	for (let i = 0; i < checkTimes.length; i++) {

		const strVal = checkTimes[i].textContent;
		let startPoint = strVal.indexOf('— ');
		// let getChar = strVal.charAt(startPoint);
		let finalyFind = strVal.slice(startPoint, -11);

		if (finalyFind.includes(timeFromClick)) {
			console.log(finalyFind.includes(timeFromClick));
			storeState.push(checkTimes[i].firstElementChild);
		}
	}
	storeState.push(btnClicked);
	return storeState;
};

const disableTimes = (timesArray, target) => {
	const targetString = target.parentNode.textContent;
	const findTime = targetString.indexOf('— ');
	const targetTime = targetString.slice(findTime, -11);

	let checked = timesArray[timesArray.length - 1].checked;

	if (!checked) {
		for (let i = 0; i < someState.length; i++) {
			let time = someState[i].parentNode.textContent;
			let findTime = time.indexOf('— ');
			let allTimes = time.slice(findTime);

			if (allTimes.includes(targetTime)) {
				someState[i].parentNode.setAttribute('style', 'opacity: 1;');
				someState[i].removeAttribute('disabled');
			}
		}
	} else if (timesArray[timesArray.length - 1].checked) {
		for (let i = 0; i < timesArray.length; i++) {
			timesArray[i].setAttribute('disabled', true);
			timesArray[i].parentNode.setAttribute('style', 'opacity: 0.4;');
			someState.push(timesArray[i]);
		}
	}
	try {
		let checked = timesArray[timesArray.length - 1].checked;
		if (checked) {
			timesArray[timesArray.length - 1].removeAttribute('disabled');
			timesArray[timesArray.length - 1].parentNode.setAttribute('style', 'opacity: 1;');
		}
	} catch (e) {
		console.error('This a problem...');
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
	const times = findCrossTimes(parent, checkBox);
	disableTimes(times, e.target);
};
console.log(nodes.total);
// ===========================================
// ---------		Section 4	 	------------------
// ===========================================
const handleCcSelection = (e) => {
	const firstDiv = nodes.fieldset[3].querySelector('DIV');
	const select = nodes.fieldset[3].querySelector('SELECT');
	const isCC = select.value === 'credit card'; // CreditCard
	const isPP = select.value === 'paypal'; // PayPal
	const isBC = select.value === 'bitcoin'; // Bitcoin

	if (isCC) {
		firstDiv.style.display = 'block';
	} else if (isPP) {
		const url = 'https://www.paypal.com/us/home';
		window.open(url, '_blank');
	} else if (isBC) {
		const url = 'https://bitcoin.org/en/';
		window.open(url, '_blank');
	} else {
		firstDiv.style.display = 'none';
	}
};


onLoad();