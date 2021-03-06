// ----------------------------------------------------------
// DATA -----------------------------------------------------
// ----------------------------------------------------------
var data_input = [
{
term: "Rust",
value: 78.9,
color: "#000000"
},
{
term: "Kotlin",
value: 75.1,
color: "#00a2ee"
},
{
term: "Python",
value: 68.0,
color: "#fbcb39"
},
{
term: "TypeScript",
value: 67.0,
color: "#007bc8"
},
{
term: "Clojure",
value: 59.6,
color: "#507dca"
}
];

var data_set =
{
container_width: 540,
container_height: 540,
general_margin: 60,
domain_min: 0,
range_min: 0,
range_max: 200,
color_svg: "#ddd",
color_layout_head: "#ccc",
color_text: "#000"
};




// ----------------------------------------------------------
// STRUCTURE ------------------------------------------------
// ----------------------------------------------------------

// set up margin
var margin = data_set.general_margin;
var width = data_set.container_width - 2 * margin;
var height = data_set.container_height - 2 * margin;

// create container for svg content
var container = d3.select("#canvas").append("svg")
.attr("width", data_set.container_width)
.attr("height", data_set.container_height)
.style("background-color", data_set.color_svg);

// ----------------------------------------------------------
// create group for layout
var layout_group = container.append("g")
.attr("class", "layout_group");

// ----------------------------------------------------------
// create group for gfx - translate the group for margin top, left
var gfx_group = container.append("g")
.attr("class", "gfx_group")
;
// create sub-group for gfx bars
var gfx_diagram = gfx_group.append("g")
.attr("class", "gfx_diagram")
.attr("transform", `translate(${margin}, ${margin})`);
;

// ----------------------------------------------------------
// create group for text
var text_group = container.append("g")
.attr("class", "text_group");

// create sub-group for text labels
var label_group = text_group.append("g")
.attr("class", "label_group");




// ----------------------------------------------------------
// GFX ------------------------------------------------------
// ----------------------------------------------------------

// SCALES & GRID  -------------------------------------------
// set up scales
// left
var yScale = d3.scaleLinear()
.range([height, 0])
.domain([0, 100]);
// bottom
var xScale = d3.scaleBand()
.range([0, width])
.domain(data_input.map((s) => s.term))
.padding(0.4)

// set up grid lines
// vertical
var makeXLines = () => d3.axisBottom()
.scale(xScale)
// horizontal
var makeYLines = () => d3.axisLeft()
.scale(yScale)

// append scales
// left
gfx_diagram.append("g")
.attr("class", "gfx_scale_left")
.call(d3.axisLeft(yScale));
// bottom
gfx_diagram.append("g")
.attr("class", "gfx_scale_bottom")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(xScale));

// append grid lines
// vertical
gfx_diagram.append("g")
.attr("class", "grid")
.attr("transform", `translate(0, ${height})`)
.call(makeXLines()
.tickSize(-height, 0, 0)
.tickFormat(""));
// horizontal
gfx_diagram.append("g")
.attr("class", "grid")
.call(makeYLines()
.tickSize(-width, 0, 0)
.tickFormat(""));


// BARS -----------------------------------------------------
// link data input to create gfx bars
var gfx_bars = gfx_diagram.selectAll()
.data(data_input)
.enter()
.append("g");

// set gfx bars attributes
gfx_bars.append("rect")
.attr("class", "bar")
.attr("x", (g) => xScale(g.term))
.attr("y", (g) => yScale(g.value))
.attr("height", (g) => height - yScale(g.value))
.attr("width", xScale.bandwidth())


// set gfx bars mouse over enter
// -------------------------------
.on("mouseenter", function (actual, i) {
d3.selectAll(".value")
.attr("opacity", 0)

d3.select(this)
.transition()
.duration(300)
.attr("opacity", 0.6)
.attr("x", (a) => xScale(a.term) - 5)
.attr("width", xScale.bandwidth() + 10)

var y = yScale(actual.value)

line = gfx_diagram.append("line")
.attr("id", "limit")
.attr("x1", 0)
.attr("y1", y)
.attr("x2", width)
.attr("y2", y)

gfx_bars.append("text")
.attr("class", "divergence")
.attr("x", (a) => xScale(a.term) + xScale.bandwidth() / 2)
.attr("y", (a) => yScale(a.value) + 30)
.attr("fill", "white")
.attr("text-anchor", "middle")

// edit text
// ------------
.text((a, idx) => {
var divergence = (a.value - actual.value).toFixed(1)

let text = ""
if (divergence > 0) text += "+"
text += `${divergence}%`

return idx !== i ? text : "";

})
// ------------

})
// -------------------------------



// set gfx bars mouse over leave
// -------------------------------
.on("mouseleave", function () {
d3.selectAll(".value")
.attr("opacity", 1)

d3.select(this)
.transition()
.duration(300)
.attr("opacity", 1)
.attr("x", (a) => xScale(a.term))
.attr("width", xScale.bandwidth())

gfx_diagram.selectAll("#limit").remove()
gfx_diagram.selectAll(".divergence").remove()
})
// -------------------------------



gfx_bars
.append("text")
.attr("class", "value")
.attr("x", (a) => xScale(a.term) + xScale.bandwidth() / 2)
.attr("y", (a) => yScale(a.value) + 30)
.attr("text-anchor", "middle")
.text((a) => `${a.value}%`)
