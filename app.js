// Query Selectors
// Buttons
const tasksViewButton = document.querySelector('#tasks-view-button')
const oncesViewButton = document.querySelector('#onces-view-button')
const penaltiesViewButton = document.querySelector('#penalties-view-button')
const rewardsViewButton = document.querySelector('#rewards-view-button')
const newButton = document.querySelector('#new-button')
const newOkButton = document.querySelector('#new-ok-button')
const deleteButton = document.querySelector('#delete-button')
const claimButton = document.querySelector('#claim-button')
// Displays
const pointsDisplay = document.querySelector('#points-display')
const viewDisplay = document.querySelector('#view-display')
const listDisplay = document.querySelector('#list-display')
const itemModalNameDisplay = document.querySelector('#item-modal-name-display')
const itemModalPointsDisplay = document.querySelector('#item-modal-points-display')
const newTypeDisplay = document.querySelector('#new-type-display')
const notEnoughPointsDisplay = document.querySelector('#not-enough-points-display')
// Modals
const newModal = document.querySelector('#new-modal')
const itemModal = document.querySelector('#item-modal')
// Inputs
const newNameInput = document.querySelector('#new-name-input')
const newPointsInput = document.querySelector('#new-points-input')

// data
let points = 0
let view = 'tasks'
let viewsData = {
  tasks: {
    name: 'Tasks',
    ItemType: 'Task',
    list: {}
  },
  onces: {
    name: 'Onces',
    ItemType: 'Once',
    list: {}
  },
  penalties: {
    name: 'Penalties',
    ItemType: 'Penalty',
    list: {}
  },
  rewards: {
    name: 'Rewards',
    ItemType: 'Reward',
    list: {}
  }
}

// Functions
function load() {
  checkLocalStorage()
  getLocalStorage()
  renderView(view)
  renderPoints()
}

// TEMPORARY FOR TESTING
const template = { user: { name: '' }, apps: {} }
function checkLocalStorage() {
  if (localStorage.getItem('hiddenUtils') === null) {
    console.log('No local storage found, new data from template will be saved')
    save(template)
  }
}
function save(data) {
  localStorage.hiddenUtils = JSON.stringify(data)
  console.log('Data saved to local storage')
}
// END TEMPORARY FOR TESTING

// Local Storage
function getLocalStorage() {
  const ls = JSON.parse(localStorage.getItem('hiddenUtils'))
  console.log('HiddenUtils local storage found: ', ls)
  if (ls.apps.rewardsPoints === undefined) {
    console.log('Local storage for Rewards Points not found')
    ls.apps.rewardsPoints = { points: points, viewsData: viewsData }
    localStorage.hiddenUtils = JSON.stringify(ls)
    console.log('New local storage for Rewards Points created')
  } else {
    console.log('Local storage for Rewards Points found')
    points = ls.apps.rewardsPoints.points
    viewsData = ls.apps.rewardsPoints.viewsData
    console.log('Local storage for Rewards Points loaded')
  }
}

function saveLocalStorage() {
  const ls = JSON.parse(localStorage.getItem('hiddenUtils'))
  ls.apps.rewardsPoints = { points: points, viewsData: viewsData }
  localStorage.hiddenUtils = JSON.stringify(ls)
  console.log('Rewards Points data saved to local storage')
}

// Render Functions
function renderPoints() {
  pointsDisplay.innerHTML = points
}

function renderView(newView) {
  view = newView
  viewDisplay.innerHTML = viewsData[view].name
  renderList()
  newTypeDisplay.innerHTML = viewsData[view].ItemType
}

function renderList() {
  let listHTML = ''
  for (const li of Object.values(viewsData[view].list)) {
    listHTML += `<li class="item" onClick="renderItemModal('${li.name}')"><div class="item-name">${li.name}</div><div class="item-points"><span>${li.points}</span></div></li>`
  }
  listDisplay.innerHTML = listHTML
}

function renderItemModal(itemName) {
  itemModalNameDisplay.innerHTML = viewsData[view].list[itemName].name
  itemModalPointsDisplay.innerHTML = viewsData[view].list[itemName].points
  itemModal.style.display = 'flex'
}

function closeModal(modal) {
  modal.style.display = 'none'
  if (modal === newModal) {
    newNameInput.value = ''
    newPointsInput.value = ''
  }
  notEnoughPointsDisplay.style.display = 'none'
}

function showNotEnoughPointsDisplay() {
  notEnoughPointsDisplay.style.display = 'block'
}

// Event Listeners
newButton.addEventListener('click', () => {
  newModal.style.display = 'flex'
})

newOkButton.addEventListener('click', () => {
  viewsData[view].list[newNameInput.value] = { name: newNameInput.value, points: parseInt(newPointsInput.value) }
  saveLocalStorage()
  renderList()
  closeModal(newModal)
})

claimButton.addEventListener('click', () => {
  const itemPoints = viewsData[view].list[itemModalNameDisplay.innerHTML].points
  if (view === 'tasks' || view === 'onces') {
    points += itemPoints
    if (view === 'onces') { delete viewsData[view].list[itemModalNameDisplay.innerHTML]; renderList() }
  } else {
    if (itemPoints > points && view !== 'penalties') { showNotEnoughPointsDisplay(); return }
    points -= itemPoints
  }
  saveLocalStorage()
  renderPoints()
  closeModal(itemModal)
})

deleteButton.addEventListener('click', () => {
  delete viewsData[view].list[itemModalNameDisplay.innerHTML]
  saveLocalStorage()
  renderList()
  closeModal(itemModal)
})

load()

// DEV:
// style item modal
// edit item
// move item (https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/37607084#37607084)
// make new form so required inputs works
// user settings, toggle allow rewards to take points into negative, off default
// user settings, toggle allow penalties to take points into negative, on default
