// Query Selectors
// Buttons
const tasksViewButton = document.querySelector('#tasks-view-button')
const oncesViewButton = document.querySelector('#onces-view-button')
const penaltiesViewButton = document.querySelector('#penalties-view-button')
const rewardsViewButton = document.querySelector('#rewards-view-button')
const newButton = document.querySelector('#new-button')
const deleteButton = document.querySelector('#delete-button')
const claimButton = document.querySelector('#claim-button')
const editButton = document.querySelector('#edit-button')
const logButton = document.querySelector('#log-button')
// Displays
const pointsDisplay = document.querySelector('#points-display')
const viewDisplay = document.querySelector('#view-display')
const listDisplay = document.querySelector('#list-display')
const itemModalNameDisplay = document.querySelector('#item-modal-name-display')
const itemModalPointsDisplay = document.querySelector('#item-modal-points-display')
const newTypeDisplay = document.querySelector('#new-type-display')
const editTypeDisplay = document.querySelector('#edit-type-display')
const notEnoughPointsDisplay = document.querySelector('#not-enough-points-display')
const logDisplay = document.querySelector('#log-display')
// Modals
const newModal = document.querySelector('#new-modal')
const itemModal = document.querySelector('#item-modal')
const editModal = document.querySelector('#edit-modal')
const logModal = document.querySelector('#log-modal')
// Inputs
const newNameInput = document.querySelector('#new-name-input')
const newPointsInput = document.querySelector('#new-points-input')
const editNameInput = document.querySelector('#edit-name-input')
const editPointsInput = document.querySelector('#edit-points-input')
// Forms
const newForm = document.querySelector('#new-form')
const editForm = document.querySelector('#edit-form')

// Mobile vh fix (make this a module for the site on game/app pages)
function vhFix() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}
vhFix()

// data
let points = 0
let view = 'tasks'
let viewsData = {
  tasks: {
    name: 'Tasks',
    ItemType: 'Task',
    color: '34, 57, 184'
  },
  onces: {
    name: 'Onces',
    ItemType: 'Once',
    color: '255, 138, 0'
  },
  penalties: {
    name: 'Penalties',
    ItemType: 'Penalty',
    color: '218, 0, 0'
  },
  rewards: {
    name: 'Rewards',
    ItemType: 'Reward',
    color: '0, 155, 0'
  }
}
let lists = {
  tasks: {},
  onces: {},
  penalties: {},
  rewards: {}
}
let log = []

// Constants
const LOG_SIZE = 10

// Functions
function load() {
  checkLocalStorage() // temp, remove before deployment
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
    ls.apps.rewardsPoints = { points: points, lists: lists, log: log }
    localStorage.hiddenUtils = JSON.stringify(ls)
    console.log('New local storage for Rewards Points created')
  } else {
    console.log('Local storage for Rewards Points found')
    points = ls.apps.rewardsPoints.points
    lists = ls.apps.rewardsPoints.lists
    log = ls.apps.rewardsPoints.log
    console.log('Local storage for Rewards Points loaded')
  }
}

function saveLocalStorage() {
  const ls = JSON.parse(localStorage.getItem('hiddenUtils'))
  ls.apps.rewardsPoints = { points: points, lists: lists, log: log }
  localStorage.hiddenUtils = JSON.stringify(ls)
  console.log('Rewards Points data saved to local storage')
}

// Data Functions
function updateLog(action, itemType, item) {
  log.push({ action: action, itemType: itemType, item: item })
  if (log.length > LOG_SIZE) { log.shift() }
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
  let i = 1
  for (const li of Object.values(lists[view])) {
    listHTML += `<li class="item" onClick="renderItemModal('${li.name}')" style="background-color:rgba(${viewsData[view].color}, ${i % 2 == 0 ? '0.8' : '1'});"><div class="item-name">${li.name}</div><div class="item-points"><span>${li.points}</span></div></li>`
    i++
  }
  listDisplay.innerHTML = listHTML
}

function renderItemModal(itemName) {
  itemModalNameDisplay.innerHTML = lists[view][itemName].name
  itemModalPointsDisplay.innerHTML = lists[view][itemName].points + ' Points'
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

editButton.addEventListener('click', () => {
  editNameInput.value = itemModalNameDisplay.innerHTML
  editPointsInput.value = parseInt(itemModalPointsDisplay.innerHTML)
  editTypeDisplay.innerHTML = viewsData[view].ItemType
  closeModal(itemModal)
  editModal.style.display = 'flex'
})

newForm.addEventListener('submit', (event) => {
  lists[view][newNameInput.value] = { name: newNameInput.value, points: parseInt(newPointsInput.value) }
  updateLog('New', viewsData[view].ItemType, newNameInput.value)
  saveLocalStorage()
  renderList()
  closeModal(newModal)
  event.preventDefault()
})

editForm.addEventListener('submit', (event) => {
  delete lists[view][itemModalNameDisplay.innerHTML]
  lists[view][editNameInput.value] = { name: editNameInput.value, points: parseInt(editPointsInput.value) }
  updateLog('Edit', viewsData[view].ItemType, editNameInput.value)
  saveLocalStorage()
  renderList()
  closeModal(editModal)
  event.preventDefault()
})

claimButton.addEventListener('click', () => {
  const itemPoints = lists[view][itemModalNameDisplay.innerHTML].points
  if (view === 'tasks' || view === 'onces') {
    points += itemPoints
    if (view === 'onces') { delete lists[view][itemModalNameDisplay.innerHTML]; renderList() }
  } else {
    if (itemPoints > points && view !== 'penalties') { showNotEnoughPointsDisplay(); return }
    points -= itemPoints
  }
  updateLog('Claim', viewsData[view].ItemType, itemModalNameDisplay.innerHTML)
  saveLocalStorage()
  renderPoints()
  closeModal(itemModal)
})

deleteButton.addEventListener('click', () => {
  delete lists[view][itemModalNameDisplay.innerHTML]
  updateLog('Delete', viewsData[view].ItemType, itemModalNameDisplay.innerHTML)
  saveLocalStorage()
  renderList()
  closeModal(itemModal)
})

logButton.addEventListener('click', () => {
  let logHTML = ''
  log.forEach((entry) => {
    logHTML += `
    <div class="app-modal-row">
      <span>${entry.action} ${entry.itemType}: ${entry.item}</span>
    </div>
    `
  })
  logDisplay.innerHTML = logHTML
  logModal.style.display = 'flex'
})

load()

// DEV:
// finalize style: new close button icon without circle, new new button icon without circle, different colors for views, color view button when active
// add help
// move item (https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/37607084#37607084), or use flexbox ordering?
// user settings, toggle allow rewards to take points into negative, off default
// user settings, toggle allow penalties to take points into negative, on default
// user settings, set log length, imp. scrolling on log-display div
