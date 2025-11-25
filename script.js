let selectedCell = null;
let selectedCells = [];

// function generateTable(){
//   const rows = Number( document.getElementById('m').value);
//   const cols = Number( document.getElementById('n').value);
//   const container = document.getElementById('table-container');
//   container.innerHTML = '';
//   const table = document.createElement('table');

//   for(let r=0; r<rows; r++){
//     const tr = document.createElement('tr');
//     for(let c=0; c<cols; c++){
//       const td = document.createElement('td');
//       td.textContent = `${r+1},${c+1}`;
//       td.addEventListener('click', e => {
//         if(e.target && e.target.tagName === 'ID'){
//           e.target.classList.toggle('selected');
//         }
//         selectCell(td,r,c);
//       })
//       tr.appendChild(td);
//     }
//     table.appendChild(tr);
//   }
//   container.appendChild(table);
// }

let currentColor = "empty";
const clrBtns = document.querySelectorAll('.clr');
function setColor(c){
  currentColor = c;
  clrBtns.forEach(b=>b.classList.remove('active-color'));
  document.getElementById('color'+c.charAt(0).toUpperCase()+c.slice(1)).classList.add('active-color');
}
document.getElementById("colorBlack").onclick = () => setColor("black");
document.getElementById("colorWhite").onclick = () => setColor("white");
document.getElementById("colorGray").onclick = () => setColor("gray");
document.getElementById("colorEmpty").onclick = () => setColor("empty");
let tableData = [];


function generateTable(){
  const rows = Number( document.getElementById('m').value);
  const cols = Number( document.getElementById('n').value);
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  const maxLayers = Math.min(rows, cols);
  for(let k = 1; k <= maxLayers; k++){
    const r = rows - k + 1;
    const c = cols - k + 1;
    const title = document.createElement('div');
    title.textContent = `${k}段目(${r}×${c})`;
    title.style.margin = '8px 0 4 px 0';
    container.appendChild(title);

    const table = document.createElement('table');
    table.className ='generated-table';

    const layer = [];

    for(let i = 0; i < r; i++){
      const tr = document.createElement('tr');
      const rowArr = [];

      for(let j = 0; j < c; j++){
        rowArr.push("empty");

        const td = document.createElement('td');
        td.textContent = `${i+1},${j+1}`;
        td.dataset.layer = k - 1;
        td.dataset.row = i;
        td.dataset.col = j;

        td.style.background = "white";

        td.onclick = () => {
          if(currentColor === "empty"){
            td.style.background = "white";
            td.textContent = '';
          } else if(currentColor === "black"){
            td.style.background = "white";
            td.textContent = '●';
            td.style.color = "black";
          } else if(currentColor === "white"){
            td.style.background = "white";
            td.textContent = '○';
          } else if(currentColor === "gray"){
            td.style.background = "white";
            td.textContent = '●';
            td.style.color = "#999";
          }
          rowArr[j] = currentColor;
        };

        tr.appendChild(td);
      }
      table.appendChild(tr);
      layer.push(rowArr);
    }
    tableData.push(layer);
    container.appendChild(table);
  }
}

// function selectCell(td,r,c){
//   // if(selectedCell) selectedCell.classList.remove('selected');
//   selectedCell = td;
//   td.classList.add('selected');
//   selectedCells.push(td);
// }

function rotate_x(x, y, z, angle) {
  const nx = Math.cos(angle)* x;
  const ny = -Math.sin(angle)* y;
  const nz = 0;
  return nx+ny+nz;
}
function rotate_y(x, y, z, angle) {
  const nx = Math.sqrt(3.0)*Math.sin(angle)* x / 2.0;
  const ny = Math.sqrt(3.0)*Math.cos(angle)* y / 2.0;
  const nz = z / 2.0;
  return nx+ny+nz;
}
function rotate_z(x, y, z, angle) {
  const nx = -Math.sin(angle)* x / 2.0;
  const ny = -Math.cos(angle)* y / 2.0;
  const nz = Math.sqrt(3.0)* z / 2.0;
  return nx+ny+nz;
}

let positions = [];
// [x,y,z,color]

function rotatePosition(){
  const rows = Number( document.getElementById('m').value);
  const cols = Number( document.getElementById('n').value);
  const angle = -Math.atan2(rows, cols);
  positions = [];
  tableData.forEach((layer, z) => {
    layer.forEach((row, y) => {
      row.forEach((cell, x) => {
        // let cx = (row.length - x+1 + 0.5*z);
        let cx = (x + 0.5*z);
        let cy = (y+ 0.5*z);
        let cz = z/Math.sqrt(2);
        const nx = rotate_x(cx, cy, cz, angle);
        const ny = rotate_y(cx, cy, cz, angle);
        const nz = rotate_z(cx, cy, cz, angle);
        let position = [nx, ny, nz, cell]; 
        positions.push(position);
      });
    });
  });
  positions.sort((a,b) => a[2] - b[2]);
}


function run() {
  let tikz = "\\begin{figure}[H]\n\t\\centering\n\t\\begin{tikzpicture}\n\t[\n\t\twhole/.style={fill=black,draw,inner sep=2pt},\n\t\twhite/.style={fill=white,draw,circle,inner sep=10pt},\n\t\tblack/.style={fill=black,draw=gray,circle,inner sep=10pt},\n\t\tgray/.style={fill=lightgray,draw,circle,inner sep=10pt}\n\t]\n";

  rotatePosition();

  positions.forEach(pos => {
    const [x, y, z, color] = pos;
    if(color !== "empty"){
      tikz += `\t\\node[${color}] at (${x.toFixed(2)}, ${y.toFixed(2)}) {};\n`;
    }
  });
  tikz += "\t\\end{tikzpicture}\n\\end{figure}";
  document.getElementById("result").value = tikz;
}


// function run(){
//   if(!selectedCell) return alert('表のセルを選択してください');
//   const [row,col] = selectedCell.textContent.split(',').map(Number);
//   const result = `選択されたセル: 行 ${row}, 列 ${col}`;
//   document.getElementById('result').value = result;
//   for (let i = 0; i < selectedCells.length; i++) {
//     console.log(`選択されたセル ${i + 1}: ${selectedCells[i].textContent}`);
//   }
// }

document.getElementById('generate').addEventListener('click', generateTable);
document.getElementById('run').addEventListener('click', run);