var COVID_Tracker = function(city) {
	this.data = false;
	
	// list of ct cities
	this.cities = ['Andover', 'Ansonia', 'Ashford', 'Avon', 'Barkhamsted', 'Beacon Falls', 'Berlin', 'Bethany', 'Bethel', 'Bethlehem', 'Bloomfield', 'Bolton', 'Bozrah', 'Branford', 'Bridgeport', 'Bridgewater', 'Bristol', 'Brookfield', 'Brooklyn', 'Burlington', 'Canaan', 'Canterbury', 'Canton', 'Chaplin', 'Cheshire', 'Chester', 'Clinton', 'Colchester', 'Colebrook', 'Columbia', 'Cornwall', 'Coventry', 'Cromwell', 'Danbury', 'Darien', 'Deep River', 'Derby', 'Durham', 'East Granby', 'East Haddam', 'East Hampton', 'East Hartford', 'East Haven', 'East Lyme', 'East Windsor', 'Eastford', 'Easton', 'Ellington', 'Enfield', 'Essex', 'Fairfield', 'Farmington', 'Franklin', 'Glastonbury', 'Goshen', 'Granby', 'Greenwich', 'Griswold', 'Groton', 'Guilford', 'Haddam', 'Hamden', 'Hampton', 'Hartford', 'Hartland', 'Harwinton', 'Hebron', 'Kent', 'Killingly', 'Killingworth', 'Lebanon', 'Ledyard', 'Lisbon', 'Litchfield', 'Lyme', 'Madison', 'Manchester', 'Mansfield', 'Marlborough', 'Meriden', 'Middlebury', 'Middlefield', 'Middletown', 'Milford', 'Monroe', 'Montville', 'Morris', 'Naugatuck', 'New Britain', 'New Canaan', 'New Fairfield', 'New Hartford', 'New Haven', 'New London', 'New Milford', 'Newington', 'Newtown', 'Norfolk', 'North Branford', 'North Canaan', 'North Haven', 'North Stonington', 'Norwalk', 'Norwich', 'Old Lyme', 'Old Saybrook', 'Orange', 'Oxford', 'Plainfield', 'Plainville', 'Plymouth', 'Pomfret', 'Portland', 'Preston', 'Prospect', 'Putnam', 'Redding', 'Ridgefield', 'Rocky Hill', 'Roxbury', 'Salem', 'Salisbury', 'Scotland', 'Seymour', 'Sharon', 'Shelton', 'Sherman', 'Simsbury', 'Somers', 'South Windsor', 'Southbury', 'Southington', 'Sprague', 'Stafford', 'Stamford', 'Sterling', 'Stonington', 'Stratford', 'Suffield', 'Thomaston', 'Thompson', 'Tolland', 'Torrington', 'Trumbull', 'Union', 'Vernon', 'Voluntown', 'Wallingford', 'Warren', 'Washington', 'Waterbury', 'Waterford', 'Watertown', 'West Hartford', 'West Haven', 'Westbrook', 'Weston', 'Westport', 'Wethersfield', 'Willington', 'Wilton', 'Winchester', 'Windham', 'Windsor', 'Windsor Locks', 'Wolcott', 'Woodbridge', 'Woodbury', 'Woodstock'];
	
	// list of ct counties
	this.counties = ['Fairfield County', 'Hartford County', 'Litchfield County', 'Middlesex County', 'New Haven County', 'New London County', 'Tolland County', 'Windham County'];

	// list of states
	this.states = ['Connecticut'];

	// list of pages
	this.pages = ['privacy', 'disclaimer', 'faq', 'attribution'];
	
	// list of days with no data (must be previous date)
	this.no_data = [];
	this.no_data_actual = [];
	
	// graphing properties
	this.graphing = {
		segmentation: 'total',
		data: 'cases',
		plotting: 'linear',
		range: 0
	};

	// generator functions
	this.buildDemographicGraph = function(segment, data) {
		var elem = segment + '-' + data;
		
		document.querySelector("#demographics .column#column-" + elem + "").innerHTML = '<h4>' + data + ' by ' + segment.replace(/s$/gi, '') + '</h4><canvas id="graph-' + elem + '" height="200"></canvas>';
		
		var ctx = document.querySelector("#demographics .column#column-" + elem + " canvas").getContext('2d');
		
		var out = [],
			labels = [];
		
		for(k in this.data.demographics[segment][data]) {
			out.push(this.data.demographics[segment][data][k]);
			
			if(segment != 'ethnicity') {
				labels.push(k.charAt(0).toUpperCase() + k.slice(1));
			} else {
				labels.push(k);
			}
		}
		
		if(segment == 'ethnicity') {
			background_colors = [
				"rgba(232, 17, 35, 0.2)", 
				"rgba(255, 140, 0, 0.2)", 
				"rgba(255, 185, 0, 0.2)", 
				"rgba(0, 204, 106, 0.2)", 
				"rgba(16, 124, 16, 0.2)", 
				"rgba(0, 183, 195, 0.2)", 
				"rgba(0, 120, 215, 0.2)", 
				"rgba(227, 0, 140, 0.2)", 
				"rgba(136, 23, 152, 0.2)"
			];
			border_colors = [
				"rgba(232, 17, 35, 1)", 
				"rgba(255, 140, 0, 1)", 
				"rgba(255, 185, 0, 1)", 
				"rgba(0, 204, 106, 1)", 
				"rgba(16, 124, 16, 1)", 
				"rgba(0, 183, 195, 1)", 
				"rgba(0, 120, 215, 1)", 
				"rgba(227, 0, 140, 1)", 
				"rgba(136, 23, 152, 1)"
			];
		} else if(segment == 'genders') {
			background_colors = ["rgb(54, 162, 235, 0.2)", "rgb(255, 99, 132, 0.2)"];
			border_colors = ["rgb(54, 162, 235, 1)", "rgb(255, 99, 132, 1)"];
		} else if(segment == 'ages') {
			background_colors = "rgb(255, 205, 86, 0.2)";
			border_colors = "rgb(255, 205, 86)";
		}
		
		window.demographics[data + '_' + segment] = new Chart(ctx, {
		    type: segment == 'genders' ? 'doughnut' : 'bar',
		    data: {
			    labels: labels,
		        datasets: [{
			        data: out,
			        backgroundColor: background_colors,
			        borderColor: border_colors,
			        borderWidth: 1
		        }]
			},
		    options: {
			    animation: {
					duration: 0
				},
				hover: {
					animationDuration: 0
				},
				responsiveAnimationDuration: 0,
			    legend: {
				    fontColor: '#fff',
				    display: false,
				    padding: 25,
				    position: 'bottom'
			    },
			    maintainAspectRatio: false,
				responsive: true,
				tooltips: {
					callbacks: {
						label: function(item, data) {
							var val = data.datasets[0].data[item.index];
							
							if(parseInt(val) >= 1000) {
								return data.labels[item.index] + ': ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
							} else {
								return data.labels[item.index] + ': ' + val;
							}
						}
					}
				},
				plugins: {
					labels: {
						fontFamily: "'Libre Franklin', sans-serif",
						render: segment == 'genders' ? function(args) {
						    return args.label + "\n" + args.percentage + '%';
						} : function(args) {
						    return args.label + "\n" + args.value;
						}
					}
				}
			}
		});
	};
	
	this.buildGraph = function(g, css) {
		if(typeof(window.graph) != 'undefined') {
			document.querySelector('#graph').remove();
			delete window.caseGraph;
		}
		
		var valid = [
			'per100k',
			'cases', 
			'deaths', 
			'hospitalizations',
			'tests',
			'delta', 
			'new', 
			'total',
			'linear', 
			'logarithmic',
			'range'
		];
		
		if(css != 'range' && valid.indexOf(g) != -1) {
			this.graphing[css] = g;
		}

		if(css == 'range') {
			if(typeof(g) == 'number') {
				this.graphing.range = g * -1;
			}
		}
		
		document.querySelector("#chart .container").innerHTML = '<canvas id="graph" height="400"></canvas>';
		
		var ctx = document.querySelector("#chart canvas").getContext('2d');
		
		var data = this.data;
		
		var dataset = false,
			labels = false,
			ticks = false,
			type = false;
		
		switch(this.graphing.data + "." + this.graphing.segmentation) {
			case "per100k.total": 
				type = 'line';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
					datasets: [
						{
							label: 'Cases Per 100K',
							data: this.calculateDailyCasesPer100K().slice(this.graphing.range),
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
						}
					],
				}; break;

			case "cases.total": 
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
					datasets: [
						{
							label: data['cases'].label,
							data: data['cases'].data.slice(this.graphing.range),
							backgroundColor: 'rgba(54, 162, 235, 0.2)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
						}
					],
				}; break;
			
			case "deaths.total": 
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
				        datasets: [
					        {
					            label: data['deaths'].label,
					            data: data['deaths'].data.slice(this.graphing.range),
					            backgroundColor: 'rgba(54, 162, 235, 0.2)',
					            borderColor: 'rgba(54, 162, 235, 1)',
					            borderWidth: 1,
								trendlineLinear: this.graphing.range < 0 ? {
									style: "rgba(255,105,180, .8)",
									lineStyle: "dotted|solid",
									width: 2
								} : null
					        }
				        ]
				}; break;
			
			case "hospitalizations.total": 
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: data['hospitalizations'].label,
					        data: data['hospitalizations'].data.slice(this.graphing.range),
				            backgroundColor: 'rgba(54, 162, 235, 0.2)',
				            borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "tests.total": 
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: data['tests'].label,
					        data: data['tests'].data.slice(this.graphing.range),
				            backgroundColor: 'rgba(54, 162, 235, 0.2)',
				            borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "cases.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'New Cases',
				            data: this.calculateDailyDifferences('cases').slice(this.graphing.range),
				            backgroundColor: 'rgba(54, 162, 235, 0.2)',
				            borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "deaths.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'New Deaths',
				            data: this.calculateDailyDifferences('deaths').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "hospitalizations.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'New Hospitalizations',
				            data: this.calculateDailyDifferences('hospitalizations').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "tests.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'New Tests',
				            data: this.calculateDailyDifferences('tests').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
				
			case "cases.delta":
				type = 'line';
				
				var delta = this.calculateDailyDelta('cases').slice(this.graphing.range);
				
				var labels = function(item, data) {
					return data.datasets[0].data[item.index] + '%';
				};
				
				var ticks = function(value, index, values) {
					return value.toString() + "%";
				};
				
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'Case Delta Rate',
				            data: delta.slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
				
			case "deaths.delta":
				type = 'line';
				
				var delta = this.calculateDailyDelta('deaths').slice(this.graphing.range);
				
				var labels = function(item, data) {
					return data.datasets[0].data[item.index] + '%';
				};
				
				var ticks = function(value, index, values) {
					return value.toString() + "%";
				};
				
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'Death Delta Rate',
				            data: delta.slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "hospitalizations.delta":
				type = 'line';
				
				var delta = this.calculateDailyDelta('hospitalizations').slice(this.graphing.range);
				
				var labels = function(item, data) {
					return data.datasets[0].data[item.index] + '%';
				};
				
				var ticks = function(value, index, values) {
					return value.toString() + "%";
				};
				
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'Hospitalization Delta Rate',
				            data: delta.slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			case "tests.delta":
				type = 'line';
				
				var delta = this.calculateDailyDelta('tests').slice(this.graphing.range);
				
				var labels = function(item, data) {
					return data.datasets[0].data[item.index] + '%';
				};
				
				var ticks = function(value, index, values) {
					return value.toString() + "%";
				};
				
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
				        {
				            label: 'Tests Delta Rate',
				            data: delta.slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 0.2)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 1,
							trendlineLinear: this.graphing.range < 0 ? {
								style: "rgba(255,105,180, .8)",
								lineStyle: "dotted|solid",
								width: 2
							} : null
				        }
			        ]
				}; break;
			
			default:
				dataset = false; break;
		}
		
		if(dataset) {
			window.graph = new window.Chart(ctx, {
			    type: type,
			    data: dataset,
			    options: {
				    animation: {
						duration: 0
					},
					hover: {
						animationDuration: 0
					},
					responsiveAnimationDuration: 0,
				    legend: {
					    display: false,
					    padding: 25,
					    position: 'bottom'
				    },
				    maintainAspectRatio: false,
					responsive: true,
			        scales: {
				        xAxes: [{
					        ticks: {
								autoSkip: true,
								maxRotation: 90,
								minRotation: 90
				            }
				        }],
			            yAxes: [{
				            type: CT.graphing.plotting,
			                ticks: {
				                autoSkip: true,
			                    beginAtZero: !this.graphing.range,
			                    callback: ticks || function(value, index, values) {
				                	if(parseInt(value) >= 1000) {
										return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
									} else {
										return value;
									}
                        		}
			                }
			            }]
			        },
			        tooltips: {
						callbacks: {
							label: labels || function(item, data) {
								var val = data.datasets[0].data[item.index];
							
								if(parseInt(val) >= 1000){
									return data.datasets[item.datasetIndex].label + ': ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								} else {
									return data.datasets[item.datasetIndex].label + ': ' + val;
								}
							}
						}
					}
			    }
			});
			
			if(['new', 'total', 'delta', 'cases', 'deaths', 'hospitalizations', 'tests'].indexOf(g) != -1 || css == 'range') {
				if(css) {
					var elems = document.querySelectorAll("#options #" + css + " ul li a");
					
					for(k in elems) {
						elems[k].className = '';
					}
					
					document.querySelector("#options #" + css + " ul li#selector-" + g + " a").className = 'selected';
				}
			} else {
				var elems2 = document.querySelectorAll("#plotting li a");
				
				for(k in elems2) {
					elems2[k].className = '';
				}
				
				document.querySelector("#plotting li#selector-" + g + " a").className = 'selected';
			}
		} else {
			alert("Invalid graph type");
		}
	};
	
	this.buildPage = function(page, data) {
		if(page != 'page') {
			document.querySelector("article").innerHTML = '';
			document.querySelector("article").style.display = 'none';
			document.querySelector("section#top").style.display = 'block';
			document.querySelector("section#twitter").style.display = 'block';
			document.querySelector("main").style.display = 'block';
		} else {
			document.querySelector("article").innerHTML = '<div class="container">' + data + '</div>';
			document.querySelector("article").style.display = 'block';
			document.querySelector("section#top").style.display = 'none';
			document.querySelector("section#twitter").style.display = 'none';
			document.querySelector("main").style.display = 'none';
		}
	};
	
	this.buildStateDropdown = function(elem) {
		elem.innerHTML = "";
		
		var states = "",
			counties = "", 
			cities = "";
		
		for(k in this.states) {
			states += [
				'<option value="' + this.formatCityName(this.states[k]) + '">',
					this.states[k],
				'</option>'
			].join("");
		}
		
		for(k in this.counties) {
			counties += [
				'<option value="' + this.formatCityName(this.counties[k]) + '">',
					this.counties[k],
				'</option>'
			].join("");
		}
		
		for(k in this.cities) {
			cities += [
				'<option value="' + this.formatCityName(this.cities[k]) + '">',
					this.cities[k],
				'</option>'
			].join("");
		}
		
		elem.innerHTML = [
			'<option selected>Choose City, Town or County</option>',
			'<optgroup label="Statewide" id="statewide">',
				states,
			'</optgroup>',
			'<optgroup label="Counties" id="counties">',
				counties,
			'</optgroup>',
			'<optgroup label="Towns/Cities" id="towns">',
				cities,
			'</optgroup>'
		].join("");
	};
	
	this.buildStatistics = function() {
		var date = new Date(Date.parse(this.data.dates[this.data.dates.length - 1] + ', 2020'));
		    date.setDate(date.getDate() + 1);
		
		document.querySelector("#updated p span").innerHTML = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()] + ' ' + date.getDate();
		
		// cases
		document.querySelector("#stats #stat-cases-new div.val").innerHTML = [
			this.formatWithCommas(
				this.data.cases.data[this.data.cases.data.length - 1] -
				this.data.cases.data[this.data.cases.data.length - 2]
			)
		].join("");

		document.querySelector("#stats #stat-cases-total div.val").innerHTML = this.formatWithCommas(this.data.cases.data[this.data.cases.data.length - 1]);

		document.querySelector("#stats #stat-cases-new div.meta div.delta").innerHTML = [
			this.formatWithDigits(this.calculateDelta('cases', this.data.cases.data.length - 1), 2) + '%',
			this.formatColumn('cases', this.calculateIncreaseOrDecrease(
				this.calculateDailyDelta('cases').slice(-1).shift(), 
				this.calculateDailyDelta('cases').slice(-2).shift()
			)) >= 0 ? ' Increase' : ' Decrease'
		].join("");

		// deaths
		document.querySelector("#stats #stat-deaths-new div.val").innerHTML = [
			this.formatWithCommas(
				this.data.deaths.data[this.data.deaths.data.length - 1] -
				this.data.deaths.data[this.data.deaths.data.length - 2]
			)
		].join("");

		document.querySelector("#stats #stat-deaths-total div.val").innerHTML = this.formatWithCommas(this.data.deaths.data[this.data.deaths.data.length - 1]);
		
		document.querySelector("#stats #stat-deaths-new div.meta div.delta").innerHTML = [
			this.formatWithDigits(this.calculateDelta('deaths', this.data.deaths.data.length - 1), 2) + '%',
			this.formatColumn('deaths', this.calculateIncreaseOrDecrease(this.calculateDailyDelta('deaths').slice(-1).shift(), this.calculateDailyDelta('deaths').slice(-2).shift())) ? ' Increase' : ' Decrease'
		].join("");

		// hospitalization
		if(typeof(this.data.hospitalizations.data) == 'object' && this.data.hospitalizations.data.length > 0) {
			document.querySelector("#stats #stat-hospitalized-new div.val").innerHTML = [
				this.formatWithCommas(Math.abs(
					this.data.hospitalizations.data[this.data.hospitalizations.data.length - 1] -
					this.data.hospitalizations.data[this.data.hospitalizations.data.length - 2]
				))
			].join("");
			
			document.querySelector("#stats #stat-hospitalized-total div.val").innerHTML = this.formatWithCommas(this.data.hospitalizations.data[this.data.hospitalizations.data.length - 1]);
			
			document.querySelector("#stats #stat-hospitalized-new div.meta div.delta").innerHTML = [
				this.formatWithDigits(this.calculateDelta('hospitalizations', this.data.hospitalizations.data.length - 1), 2) + '%',
				this.formatColumn('hospitalized', this.calculateIncreaseOrDecrease(this.calculateDailyDelta('hospitalizations').slice(-1).shift(), this.calculateDailyDelta('hospitalizations').slice(-2).shift())) ? ' Increase' : ' Decrease'
			].join("");
		}

		// tests
		document.querySelector("#stats #stat-tests-new div.val").innerHTML = [
			this.formatWithCommas(Math.abs(
				this.data.tests.data[this.data.tests.data.length - 1] -
				this.data.tests.data[this.data.tests.data.length - 2]
			))
		].join("");

		document.querySelector("#stats #stat-tests-total div.val").innerHTML = this.formatWithCommas(this.data.tests.data[this.data.tests.data.length - 1]);
		
		document.querySelector("#stats #stat-tests-new div.meta div.delta").innerHTML = [
			this.formatWithDigits(this.calculateDelta('tests', this.data.tests.data.length - 1), 2) + '%',
			this.formatColumn('tests', this.calculateIncreaseOrDecrease(this.calculateDailyDelta('tests').slice(-2).shift(), this.calculateDailyDelta('tests').slice(-1).shift())) ? ' More Than Yest.' : ' Less Than Yest.'
		].join("");

		// cases per 100k
		if(typeof(this.data.covidactnow) == 'object') {
			document.querySelector("#stats #stat-per-100k div.val").innerHTML = this.formatColorIndicator('density', this.calculateCasesPer100K());

			// r0
			document.querySelector("#stats #stat-r0 div.val").innerHTML = this.formatColorIndicator('r0', this.data.covidactnow.data.r0);

			// test positivity rate
			document.querySelector("#stats #stat-tpr div.val").innerHTML = this.formatColorIndicator('positivity', this.calculateTestPositivityRate());

			// cases per 100k
			document.querySelector("#stats #stat-fatality-rate div.val").innerHTML = this.calculateFatalityRate();
		} else {
			document.querySelector("#stats #stat-per-100k div.val").innerHTML = this.formatColorIndicator('density', this.calculateCasesPer100K());
			document.querySelector("#stats #stat-tpr div.val").innerHTML = this.formatColorIndicator('positivity', this.calculateTestPositivityRate());
			document.querySelector("#stats #stat-fatality-rate div.val").innerHTML = this.calculateFatalityRate();
		}

		// college town indicator
		document.querySelector("#badges").innerHTML = '';
		if(this.data.city != 'Connecticut') {
			if(this.calculateCasesPer100K() >= 15) {
				document.querySelector("#badges").innerHTML += '<span class="red-alert" title="This city/town has critical levels of infection">Red Alert</span>';
			} else if(this.calculateCasesPer100K() >= 10) {
				document.querySelector("#badges").innerHTML += '<span class="orange-alert" title="This city/town has near critical levels of infection">Orange Alert</span>';
			} else if(this.calculateCasesPer100K() >= 5) {
				document.querySelector("#badges").innerHTML += '<span class="yellow-alert" title="This city/town has significant levels of infection">Yellow Alert</span>';
			} else {
				document.querySelector("#badges").innerHTML += '<span class="on-alert" title="This city/town must has normal levels of infection">On Alert - Stay Vigilent</span>';
			}
		}
		
		if(typeof(this.data.colleges) == 'object' && this.data.colleges.length > 0) {
			document.querySelector("#badges").innerHTML += '<span class="college">College/University Town</span>';
		}
	};

	this.buildCovidActNowMessage = function() {
		var cls = ['low', 'medium', 'high', 'critical'];

		

		for(k in this.data.covidactnow.thresholds[type]) {
			if(num <= this.data.covidactnow.thresholds[type][k]) {
				idx = k - 1;
			}
		}

		return cls;
	};
	
	this.buildSummaryMessage = function() {
		var a = this.calculateTrend('cases', 6),
			b = this.calculateTrend('deaths', 6),
			c = this.calculateSum(this.data.cases.data),
			d = this.calculateSum(this.data.deaths.data);
			
		var message = "";
		
		switch(a + b) {
			case -2: 
				message = (function(a, b, c, d, e) {
					return 'Over the past 5 days, new cases and deaths are <strong class="good">currently decreasing</strong> in ' + e + '. This means that social distancing and wearing face coverings are likely working and, as a result, <strong>new cases are being prevented and lives are being saved</strong>.';
				})(a, b, c, d, this.data.city);
				
				break;
			
			case -1: 
			case 1:
				message = (function(a, b, c, d, e) {
					if(a == -1) {
						return 'Over the past 5 days, new cases are <strong class="good">currently decreasing</strong> in ' + e + ', ' + (d > 0 ? 'however, deaths are <strong class="bad">currently increasing</strong> for several days' : 'thankfully, <strong class="good">there have not been any deaths to date</strong>') + '.';
					} else if(a == 1) {
						return 'Over the past 5 days, new cases are <strong class="bad">currently increasing</strong> in ' + e + ', ' + (d > 0 ? 'however, deaths <strong>have been relatively flat</strong> for several days' : 'thankfully, <strong class="good">there have not been any deaths to date</strong>') + '.';
					}
				})(a, b, c, d, this.data.city);
					
				break;
				
			case 0: 
				message = (function(a, b, c, d, e) {
					if(c == 0 && d == 0) {
						return 'There are currently <strong class="good">no known cases</strong> of COVID-19 in ' + e + '. This does not guarantee that there are no cases &mdash; individuals may be asymptomatic, not yet diagnosed or currently in the incubation period. <strong>Strict adherence to wearing a face covering and social distancing must still be maintained</strong>.';
					} else if(a == 0 && b == 0) {
						return [
							'New cases of COVID-19 in ' + e + ' <strong class="good">have been relatively flat</strong> for several days. It is imperative to <strong>continue engaging in social distancing and wear a face covering</strong> as COVID-19 can spread asymptomatically.'
						].join("");
					} else if(a == 1) {
						return 'Over the past 5 days, new cases are <strong class="bad">currently increasing</strong> in ' + e + ', however, deaths are <strong class="good">currently decreasing</strong>.';
					} else {
						return 'Over the past 5 days, new cases are <strong class="good">currently decreasing</strong> in ' + e + ', however, deaths are <strong class="bad">currently increasing</strong>.';
					}
				})(a, b, c, d, this.data.city);
				
				break;
			
			case 2: 
				message = (function(a, b, c, d, e) {
					return 'Over the past 5 days, new cases and new deaths are <strong class="bad">currently increasing</strong> in ' + e + '.';
				})(a, b, c, d, this.data.city);
				
				break;
		}
		
		message = '<p>' + message + ' <strong>New cases and deaths can still happen at any time</strong>. Continue to social distance, wear a face covering and follow the practices and instructions provided to you from your local, state and/or federal health officials.</p>';
		
		if(a == 0 && c != 0 && 0) {
			message += '<p><strong>Important:</strong> While it may appear that the new cases graph is beginning to flatten, it is important to remember that a limited time of no growth is not necessarily indicative of a long-term trend; consistent decreases in nearby towns and cities is required to declare a flattening curve.</p>';
		}
		
		return message;
	};
	
	this.buildTable = function() {
		var html = [];
		
		for(k in this.data.dates) {
			html.push([
				'<tr' + (k <= (this.data.dates.length - 14) ? ' class="hideable"' : '') + '>',
					'<td>' + this.data.dates[k] + '</td>',
					'<td>' + this.formatWithCommas(this.data.cases.data[k]) + '</td>',
					'<td>' + this.calculateDifferenceAtIndex('cases', k) + '</td>',
					'<td>' + this.formatWithDigits(this.calculateDelta('cases', k), 2) + '%</td>',
					'<td>' + this.formatWithCommas(this.data.deaths.data[k]) + '</td>',
					'<td>' + this.calculateDifferenceAtIndex('deaths', k) + '</td>',
					'<td>' + this.formatWithDigits(this.calculateDelta('deaths', k), 2) + '%</td>',
					'<td>' + this.calculateAttackRate(this.data.dates.length - k) + '</td>',
				'</tr>'
			].join(""));
			
			if(this.no_data.indexOf(this.data.dates[k]) != -1) {
				html.push([
					'<tr>',
						'<td>' + this.no_data_actual[this.no_data.indexOf(this.data.dates[k])] + '</td>',
						'<td colspan="7">The State of Connecticut did not report data on ' + this.no_data_actual[this.no_data.indexOf(this.data.dates[k])] + '</td>',
					'</tr>'
				].join(""));
			}
		}
		
		document.querySelector("#table div.container").innerHTML = [
			'<h3>Cases In ' + this.data.city + '</h3>',
			'<table width="100%" border="1">',
				'<thead>',
					'<th>Date</th>',
					'<th>Total Cases</th>',
					'<th>New Cases</th>',
					'<th>Case Delta</th>',
					'<th>Total Deaths</th>',
					'<th>New Deaths</th>',
					'<th>Death Delta</th>',
					'<th>Infection Rate</th>',
				'</thead>',
				'<tbody>',
					html.reverse().join(""),
				'</tbody>',
				'<tfoot>',
					'<tr>',
						'<td colspan="8"><a href="javascript:;" onclick="javascript:void(CT.toggleTable());">Show All Dates</a></td>',
					'</tr>',
				'</tfoot>',
			'</table>'
		].join("");
	};

	this.buildTableSchool = function() {
		if(this.data.city != 'connecticut' && this.data.city.indexOf('county') == -1) {
			var html = [];
			
			if(typeof(this.data.schools) == 'object') {
				for(k in this.data.schools) {
					var schools = this.data.schools[k];
					break;
				}

				if(typeof(schools) == 'object') {
					for(k in schools) {
						if(schools[k].cases == 0) {
							continue;
						}

						html.push([
							'<tr>',
								'<td>' + schools[k].name + '</td>',
								'<td>' + schools[k].cases + '</td>',
							'</tr>'
						].join(""));
					}

					if(html.length == 0) {
						html.push([
							'<tr>',
								'<td colspan="2">There have been no known cases of COVID-19 in ' + this.data.city + ' schools</td>',
							'</tr>'
						].join(""));
					}
					
					document.querySelector("#schools div.container").innerHTML = [
						'<h3>Cases in ' + this.data.city + ' Schools (K-12)</h3>',
						'<p>Please Note: Only schools with at least 1 or more positive case of COVID-19 will be shown below.</p>',
						'<p>Last Updated: ' + schools[0].date + '</p>',
						'<table width="100%" border="1">',
							'<thead>',
								'<th>School</th>',
								'<th>Total Cases</th>',
							'</thead>',
							'<tbody>',
								html.join(""),
							'</tbody>',
						'</table>'
					].join("");
					
					document.querySelector("#schools div.container").style.display = 'block';
				}
			}
		} else {
			document.querySelector("#schools div.container").style.display = 'none';
		}
	}
	
	// calculation functions
	this.calculateAverage = function(data) {
		var t = 0;
		
		for(k in data) {
			t += parseInt(data[k], 10);
		}
		
		return t / data.length;
	};

	this.calculateDailyCasesPer100K = function() {
		var daily = this.calculateDailyDifferences('cases');
		var out = [];

		for(k in daily) {
			out.push(this.formatWithDigits((parseInt(daily[k], 10) / parseInt(this.data.population, 10)) * 100000, 1));
		}

		return out;
	};
	
	this.calculateDailyDifferences = function(type) {
		var output = [];
		
		for(k in this.data[type].data) {
			if(!isNaN(this.data[type].data[k - 1])) {
				output.push(this.data[type].data[k] - this.data[type].data[k - 1]);
			} else {
				output.push(0);
			}
		}
		
		return output;
	};
	
	this.calculateDailyDelta = function(type) {
		var deltas = new Array();
		
		var first = false;
		
		for(k in this.data[type].data) {
			if(k == 0) {
				deltas.push(0);
			} else {
				deltas.push(parseFloat(this.formatWithDigits(this.calculateDelta(type, k), 2)));
			}
		}
		
		return deltas;
	};
	
	this.calculateDelta = function(type, index) {
		var a = index || 0,
			b = a - 1;
			
		if(
			isNaN(this.data[type].data[a]) || 
			isNaN(this.data[type].data[b]) || 
			isNaN(this.data[type].data[a] / this.data[type].data[b])
		) {
			return 0;
		}
		
		var delta = ((this.data[type].data[a] / this.data[type].data[b]) - 1) * 100;
		
		return delta != Infinity ? delta : 100;
	};
	
	this.calculateDifferenceAtIndex = function(type, index) {
		var a = index || 0,
			b = a - 1;
			
		if(isNaN(this.data[type].data[a]) || isNaN(this.data[type].data[b])) {
			return 0;
		}
		
		return this.formatWithCommas(this.data[type].data[a] - this.data[type].data[b]);
	};
	
	this.calculateIncreaseOrDecrease = function(a, b) {
		return a == b ? 0 : (a > b ? 1 : -1);
	};

	this.calculateCasesPer100K = function(index) {
		index = index || 0;

		if(!isNaN(parseInt(this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)).replace(',', ''), 10))) {
			result = (parseInt(this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)).replace(',', ''), 10) / this.data.population) * 100000;

			if(this.data.updated.day == 'Sun') {
				//result = result / 3;
			}
			
			return this.formatWithDigits(result, 1);
		}

		return 0;
	};
	
	this.calculateFatalityRate = function(index) {
		if(!isNaN(this.data.deaths.data[this.data.deaths.data.length - (index || 1)])) {
			result = (this.data.deaths.data[this.data.deaths.data.length - (index || 1)] / this.data.cases.data[this.data.cases.data.length - (index || 1)]) * 100;
		}
		
		return this.formatWithDigits(result || 0, 2) + '%';
	};
	
	this.calculateHospitalizationRate = function(index) {
		if(!isNaN(this.data.hospitalizations.data[this.data.hospitalizations.data.length - (index || 1)])) {
			result = (this.data.hospitalizations.data[this.data.hospitalizations.data.length - (index || 1)] / this.data.cases.data[this.data.cases.data.length - (index || 1)]) * 100;
		}
		
		return this.formatWithDigits(result || 0, 2) + '%';
	};
	
	this.calculateAttackRate = function(index) {
		if(!isNaN(this.data.cases.data[this.data.cases.data.length - (index || 1)])) {
			result = (this.data.cases.data[this.data.cases.data.length - (index || 1)] / this.data.population) * 100;
		}
		
		return this.formatWithDigits(result || 0, 2) + '%';
	};
	
	this.calculateSum = function(data) {
		var sum = 0;
		
		for(k in data) {
			sum += parseInt(data[k], 10);
		}
		
		return sum;
	};
	
	this.calculateTestPositivityRate = function(index) {
		var cases = parseInt(this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)).replace(',', ''), 10),
			tests = parseInt(this.calculateDifferenceAtIndex('tests', this.data.tests.data.length - (index || 1)).replace(',', ''), 10);

		if(!isNaN(cases) && !isNaN(tests)) {
			result = (cases / tests) * 100;
		}
		
		return this.formatWithDigits(result || 0, 2) + '%';
	};
	
	this.calculateTrend = function(type, count) {
		var data = false;
		var first = false;
		
		if(this.calculateDailyDifferences(type).length >= count) {
			data = this.calculateDailyDifferences(type).slice(count * -1);
		}
		
		if(data && (data.length < 4 || (count % 2) != 0)) {
			return false;
		}
		
		for(k in data) {
			if(data[k] != 0) {
				first = k;
				break;
			}
		}
		
		if((data.length - first) < count) {
			data = data.slice(first);
			
			if(data % 2 != 0) {
				data = data.slice(1);
			}
		}
		
		var b = this.calculateSum(data.slice(0, data.length / 2)),
			a = this.calculateSum(data.slice((data.length / 2) * -1));
			
		if(a == b) {
			var data2 = this.data[type].data.slice(count * -1),
				first = 0;
			
			for(k in data2) {
				if(data[k] != 0) {
					first = k - 1;
					break;
				}
			}
			
			if((data2.length - first) < count) {
				data2 = data2.slice(first);
				
				if(data2 % 2 != 0) {
					data2 = data2.slice(1);
				}
			}
			
			var c = this.calculateAverage(data2.slice(0, data2.length / 2)),
				d = this.calculateAverage(data2.slice((data2.length / 2) * -1));
				
			if(c != d) {
				if(c < d) {
					a = a + 1;
				} else {
					b = b + 1;
				}
			}
		}
		
		if(b == 0) {
			if(a != 0) {
				a = -1;
			}
		}
		
		return a === b ? 0 : (a < b ? -1 : 1);
	};
	
	// formatting functions
	this.formatColorIndicator = function(type, val) {
		var thresholds = {
			'density': [0, 1, 10, 25],
			'icu': [0, 50, 60, 70],
			'positivity': [0, 3, 10, 20],
			'r0': [0, 0.9, 1, 1.4],
			'tracers': [0, 90, 10, 0]
		};
		
		var cls = ['low', 'medium', 'high', 'critical'];
		var idx = 0;

		var num = parseFloat(val);

		for(threshold in thresholds[type]) {
			if(num >= thresholds[type][threshold]) {
				idx = threshold;
			}
		}

		return '<span class="' + cls[Math.max(0, idx)] + '">' + val + '</span>';
	};

	this.formatColumn = function(type, val) {
		switch(val) {
			case -1: (function() {
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta increasing";
				})(); break;
			case 0: (function() {
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta flat";
				})(); break;
			case 1: (function() {
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta decreasing";
				})(); break;
		}
		
		return val;
	};
	
	this.formatCityName = function(city) {
		return city.trim().replace(/\s/g, "_").toLowerCase();
	};
	
	this.formatWithCommas = function(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};
	
	this.formatWithDigits = function(num, digits) {
		if(typeof(num) == 'number') {
			return num.toFixed(digits);
		}
		
		return null;
	};
	
	// ui
	this.toggleTable = function() {
		document.querySelector("#table table tfoot").style.display = 'none';
		
		var elems = document.querySelectorAll("#table table tbody tr.hideable");
		
		for(e in elems) {
			elems[e].className = '';
		}
	};
	
	// fetchers
	this.fetchData = function(url) {
		var ajax = new XMLHttpRequest();
			
			if(url.indexOf(".json") != -1) {
				ajax.overrideMimeType('application/json');
			} else {
				ajax.overrideMimeType('text/plain');
			}
			
			ajax.open('GET', url, true);
			ajax.send();
		
		if(url.indexOf(".json") != -1) {
			ajax.onload = function() {
				if(this.status >= 200 && this.status < 400) {
					CT.dataReady(JSON.parse(this.response));
				} else {
					alert("Error retrieving information. Please try again.")
				}
			};
		} else {
			ajax.onload = function() {
				if(this.status >= 200 && this.status < 400) {
					CT.dataReady(this.response);
				} else {
					alert("Error retrieving information. Please try again.")
				}
			};
		}
		
		return true;
	};
	
	// validation functions
	this.validateCity = function(city) {
		for(k in this.cities) {
			if(this.formatCityName(city) == this.formatCityName(this.cities[k])) {
				return true;
			}
		}
		
		for(k in this.counties) {
			if(this.formatCityName(city) == this.formatCityName(this.counties[k])) {
				return true;
			}
		}
		
		return city === 'connecticut';
	};
	
	this.validatePage = function(city) {
		return this.pages.indexOf(city) != -1;
	}
	
	// ui functions
	this.changeCity = function(city) {
		if(this.validatePage(city)) {
			this.fetchData('pages/' + this.formatCityName(city) + '.txt?' + window.Build);
		} else if(this.validateCity(city)) {
			this.graphing.range = 0;
			this.fetchData('data/' + this.formatCityName(city) + '.json?' + window.Build);
			
			try {
				window.localStorage.setItem('last_viewed_city', city);
			} catch(e) {}
		} else {
			return window.location.hash = 'connecticut';
		}
	}
	
	this.dataReady = function(data) {
		window.scrollTo(0, 0);
		
		if(typeof(data) == 'object') {
			this.data = data;
			
			this.buildGraph('total', 'segmentation');
			this.buildGraph('cases', 'data');
			this.buildGraph('linear', 'plotting');
			this.buildGraph('0', 'range');
			this.buildPage('data', data);
			this.buildSummaryMessage();
			this.buildStatistics();
			this.buildTable();
			this.buildTableSchool();
			
			document.querySelector("#meta #summary").innerHTML = this.buildSummaryMessage();
			document.querySelector("#meta #city").innerHTML = this.data.city + (this.data.city != 'Connecticut' ? ', Connecticut' : '');
			document.querySelector("#meta #population").innerHTML = 'Estimated Population: ' + this.formatWithCommas(this.data.population);
			
			this.buildStateDropdown(document.querySelector("nav select"));
			
			document.getElementById("demographics").style.display = 'none';
			
			if(this.formatCityName(this.data.city) == 'connecticut') {
				document.body.className = 'state';
				document.getElementById("demographics").style.display = 'block';
				
				this.buildDemographicGraph('ages', 'cases');
				this.buildDemographicGraph('ages', 'deaths');
				this.buildDemographicGraph('ethnicity', 'cases');
				this.buildDemographicGraph('ethnicity', 'deaths');
				this.buildDemographicGraph('genders', 'cases');
				this.buildDemographicGraph('genders', 'deaths');
			} else if(this.formatCityName(this.data.city).indexOf('_county') != -1) {
				document.body.className = 'county';
			} else {
				document.body.className = 'city';
			}
		} else {
			this.buildPage('page', data);
			this.buildStateDropdown(document.querySelector("nav select"));
		}
	}
	
	// event handlers
	document.querySelector("nav select").addEventListener('change', function() {
		if(this.value) {
			window.location.hash = CT.formatCityName(this.value);
		}
	})
	
	window.onhashchange = function() {
		CT.changeCity(window.location.hash != '' ? window.location.hash.replace('#', '') : 'connecticut');
		CT.buildStateDropdown(document.querySelector("nav select"));
	}
	
	// default actions
	this.changeCity(city);
};