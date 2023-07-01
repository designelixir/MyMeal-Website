function file5Analyze(dataRows, targetDiv){
    const parsedMenuItemData = dataRows.map(row => {
        const values = row.split(',');

        // get the number of sessions that lasted x time 
        
        const restaurant = values[2];
        const menuItem = values[3];
        const menuSelections = Number(values[4]) 
        
        return {restaurant, menuItem, menuSelections};
        
        });
        const resultDiv = document.getElementById(targetDiv);
        resultDiv.textContent = JSON.stringify(parsedMenuItemData, null, 2);
        createMenuItemArray(parsedMenuItemData)
}

function createMenuItemArray(parsedMenuItemData) {
  const dateRangeOfPDF = getInput();
  console.log(dateRangeOfPDF)  
  const menuItemArray = [];
  
    for (let i = 0; i < parsedMenuItemData.length; i++) {
      const data = parsedMenuItemData[i];
      const restaurant = data.restaurant;
      const menuItem = data.menuItem;
      const totalSelections = Number(data.menuSelections);
  
      // Check if the restaurant exists in menuItemArray
      const existingRestaurant = menuItemArray.find(item => Object.keys(item)[0] === restaurant);
  
      if (existingRestaurant) {
        // If the restaurant already exists, update the menuItem-totalSelections pair
        existingRestaurant[restaurant][menuItem] = (existingRestaurant[restaurant][menuItem] || 0) + totalSelections;
      } else {
        // If the restaurant is new, create a new menuItem-totalSelections pair
        const menuItemPair = { [restaurant]: { [menuItem]: totalSelections } };
        menuItemArray.push(menuItemPair);
      }
    }
  
    // Sort the menuItemArray based on totalSelections in descending order
    menuItemArray.sort((a, b) => {
      const totalSelectionsA = Object.values(a[Object.keys(a)[0]]).reduce((sum, value) => sum + value, 0);
      const totalSelectionsB = Object.values(b[Object.keys(b)[0]]).reduce((sum, value) => sum + value, 0);
      return totalSelectionsB - totalSelectionsA;
    });
  
    // Create tables for each restaurant in menuItemArray
    for (const item of menuItemArray) {
      const restaurant = Object.keys(item)[0];
      const menuItemData = item[restaurant];
  
      // Find the existing restaurant div
      const restaurantDiv = document.getElementById(restaurant + '-bottom-wrapper');
      
      if (restaurantDiv) {
        const menuItemList = document.createElement('div')
      restaurantDiv.appendChild(menuItemList)
  
      const menuItemDescription = document.createElement('h3')
      menuItemDescription.textContent = "Top Menu Items"
      
      
      menuItemList.appendChild(menuItemDescription)
        // Create a table for the restaurant
        const list = document.createElement("ol");
  
        // Convert the menuItemData object to an array of [menuItem, totalSelections] pairs
        const menuItemArray = Object.entries(menuItemData);
  
        // Sort the menuItemArray based on totalSelections in descending order
        menuItemArray.sort((a, b) => b[1] - a[1]);
  
        // Create table rows for each menuItem and totalSelections
        for (let j = 0; j < 10 && j < menuItemArray.length; j++) {
          const [menuItem, totalSelections] = menuItemArray[j];
          const newListItem = document.createElement('li');
          newListItem.innerHTML = "<p class='menu-item'><strong>" + menuItem + "</strong> [ " + totalSelections + " Clicks]</p>";
          list.appendChild(newListItem);
        }
  
        menuItemList.appendChild(list);
        const fileName = restaurant.replace(/\s/g, '') + '-Analytics-' + dateRangeOfPDF;
        document.getElementById('menu-items-container').classList.remove('unfinished-shadow')
        document.getElementById('generate-buttons').style.display = "block"
        // generateButtons(fileName, restaurant)

        
      }
    }
    
  }
 
  function getInput() {
    const userInput = prompt('Please enter the date range of the analytics reports. ie: 5.1.2023-5.31.2023');
    return userInput;
  }

function generateButtons(fileName, restaurant) {
  const pdfWrapper = document.getElementById(restaurant+'-pdf-wrapper');
  const downloadButton = document.createElement('div');
  downloadButton.className = 'download-button'
  downloadButton.id = restaurant+'-download-button'
  downloadButton.textContent = "Download " + restaurant + " Report"
  pdfWrapper.appendChild(downloadButton)
  
  downloadButton.onclick = downloadDivAsPDF(restaurant, fileName)
} 


