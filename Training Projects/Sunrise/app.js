const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const circlesPerPage = [80, 180, 50];
let currentPage = 1;
let isDragging = false;
let selectedCircle = null;

const pages = [
  Array.from({ length: circlesPerPage[0] }, (_, index) =>
    createCircle(50 + index * 10, 50)
  ),
  Array.from({ length: circlesPerPage[1] }, (_, index) =>
    createCircle(50 + index * 10, 150)
  ),
  Array.from({ length: circlesPerPage[2] }, (_, index) =>
    createCircle(50 + index * 10, 250)
  ),
];

function createCircle(x, y) {
  return { x, y, radius: 30, color: "darkgray" };
}

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("dblclick", handleCanvasDoubleClick);

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pages[currentPage - 1].forEach((circle) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });
}

function handleMouseDown(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  selectedCircle = pages[currentPage - 1].find((circle) => {
    const distance = Math.sqrt(
      (mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2
    );
    return distance <= circle.radius;
  });

  if (selectedCircle) {
    isDragging = true;
  }
}

function handleMouseMove(event) {
  if (isDragging && selectedCircle) {
    selectedCircle.x = event.clientX - canvas.getBoundingClientRect().left;
    selectedCircle.y = event.clientY - canvas.getBoundingClientRect().top;
    drawCircles();
  }
}

function handleMouseUp() {
  isDragging = false;
  selectedCircle = null;
}

function changeCircleColor(circle, daysLeft) {
  // Assume daysLeft is calculated somehow
  if (daysLeft <= 0) {
    circle.color = "red";
  } else if (daysLeft === 2) {
    circle.color = "yellow";
  } else if (daysLeft > 2) {
    circle.color = "green";
  } else {
    circle.color = "darkgray";
  }
}

function nextPage() {
  if (currentPage < pages.length) {
    currentPage++;
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    drawCircles();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    drawCircles();
  }
}

function addCircles() {
  const additionalCircles = prompt("Enter the number of circles to add:");
  const parsedCircles = parseInt(additionalCircles);

  if (!isNaN(parsedCircles) && parsedCircles > 0) {
    pages[currentPage - 1] = [
      ...pages[currentPage - 1],
      ...Array.from({ length: parsedCircles }, (_, index) =>
        createCircle(
          50 + index * 10,
          50 + (pages[currentPage - 1].length + index) * 10
        )
      ),
    ];
    drawCircles();
  } else {
    alert("Invalid input. Please enter a positive number.");
  }
}

function removeCircles() {
  const circlesToRemove = prompt("Enter the number of circles to remove:");
  const parsedCircles = parseInt(circlesToRemove);

  if (!isNaN(parsedCircles) && parsedCircles > 0) {
    if (parsedCircles >= pages[currentPage - 1].length) {
      alert("Cannot remove more circles than available.");
    } else {
      pages[currentPage - 1] = pages[currentPage - 1].slice(0, -parsedCircles);
      drawCircles();
    }
  } else {
    alert("Invalid input. Please enter a positive number.");
  }
}

function handleCanvasDoubleClick(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  const clickedCircle = pages[currentPage - 1].find((circle) => {
    const distance = Math.sqrt(
      (mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2
    );
    return distance <= circle.radius;
  });

  if (clickedCircle) {
    const guestInfo = prompt(
      "Enter guest information separated by spaces (Guest Name Arrival Departure Total_Duration):"
    );

    if (guestInfo) {
      const [guestName, arrival, departure, totalDuration] =
        guestInfo.split(" ");
      const box = createGuestInfoBox(
        guestName,
        arrival,
        departure,
        totalDuration
      );
      document.body.appendChild(box);
    } else {
      alert("Invalid input. Please enter valid values.");
    }
  }
}

function createGuestInfoBox(guestName, arrival, departure, totalDuration) {
  const box = document.createElement("div");
  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.border = "2px solid black";
  box.style.padding = "10px";
  box.style.backgroundColor = "white";
  box.style.zIndex = "999";

  const guestNameLabel = document.createElement("label");
  guestNameLabel.textContent = "Guest Name:";
  const guestNameInput = document.createElement("input");
  guestNameInput.type = "text";
  guestNameInput.value = guestName;

  const arrivalLabel = document.createElement("label");
  arrivalLabel.textContent = "Arrival:";
  const arrivalInput = document.createElement("input");
  arrivalInput.type = "text";
  arrivalInput.value = arrival;

  const departureLabel = document.createElement("label");
  departureLabel.textContent = "Departure:";
  const departureInput = document.createElement("input");
  departureInput.type = "text";
  departureInput.value = departure;

  const totalDurationLabel = document.createElement("label");
  totalDurationLabel.textContent = "Total Duration:";
  const totalDurationInput = document.createElement("input");
  totalDurationInput.type = "text";
  totalDurationInput.value = totalDuration;

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save Changes";
  saveButton.onclick = () => {
    // Save changes logic here...
    alert("Changes saved!");
    document.body.removeChild(box);
  };

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Circle";
  deleteButton.onclick = () => {
    // Delete circle logic here...
    pages[currentPage - 1] = pages[currentPage - 1].filter(
      (circle) => circle !== clickedCircle
    );
    drawCircles();
    document.body.removeChild(box);
  };

  box.appendChild(guestNameLabel);
  box.appendChild(guestNameInput);
  box.appendChild(document.createElement("br"));

  box.appendChild(arrivalLabel);
  box.appendChild(arrivalInput);
  box.appendChild(document.createElement("br"));

  box.appendChild(departureLabel);
  box.appendChild(departureInput);
  box.appendChild(document.createElement("br"));

  box.appendChild(totalDurationLabel);
  box.appendChild(totalDurationInput);
  box.appendChild(document.createElement("br"));

  box.appendChild(saveButton);
  box.appendChild(deleteButton);

  return box;
}
