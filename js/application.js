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
		
		document.querySelector("#demographics .column#column-" + elem + "").innerHTML = [
			'<h4>' + data + ' by ' + segment.replace(/s$/gi, '') + '</h4>',
			this.buildDemographicSummaryChart(segment, data)
		].join("");
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
							borderWidth: 1
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
							backgroundColor: 'rgba(54, 162, 235, 1)',
							borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 0
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
					            backgroundColor: 'rgba(54, 162, 235, 1)',
					            borderColor: 'rgba(54, 162, 235, 1)',
					            borderWidth: 0
					        }
				        ]
				}; break;
			
			case "hospitalizations.total": 
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
						{
							type: 'line',
							label: 'Total Hospitalized 7 Day Average',
							data: this.calculateMovingAverage(data['hospitalizations'].data.slice(this.graphing.range), 7),
							backgroundColor: 'rgba(255, 255, 255, 0)',
							borderColor: 'rgba(255, 0, 0, 1)',
							borderWidth: 1,
							pointRadius: 0,
							pointHitRadius: 0,
							pointHoverRadius: 0,
							lineTension: 0
						},
				        {
				            label: data['hospitalizations'].label,
					        data: data['hospitalizations'].data.slice(this.graphing.range),
				            backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
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
				            backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
			
			case "cases.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
						{
							type: 'line',
							label: 'New 7 Day Case Average',
							data: this.calculateMovingAverage(this.calculateDailyDifferences('cases').slice(this.graphing.range), 7),
							backgroundColor: 'rgba(255, 255, 255, 0)',
							borderColor: 'rgba(255, 0, 0, 1)',
							borderWidth: 1,
							pointRadius: 0,
							pointHitRadius: 0,
							pointHoverRadius: 0,
							lineTension: 0
						},
				        {
							type: 'bar',
				            label: 'New Cases',
				            data: this.calculateDailyDifferences('cases').slice(this.graphing.range),
				            backgroundColor: 'rgba(54, 162, 235, 1)',
				            borderColor: 'rgba(54, 162, 235, 1)',
							borderWidth: 0
				        }
			        ]
				}; break;
			
			case "deaths.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
						{
							type: 'line',
							label: 'New 7 Day Death Average',
							data: this.calculateMovingAverage(this.calculateDailyDifferences('deaths').slice(this.graphing.range), 7),
							backgroundColor: 'rgba(255, 255, 255, 0)',
							borderColor: 'rgba(255, 0, 0, 1)',
							borderWidth: 1,
							pointRadius: 0,
							pointHitRadius: 0,
							pointHoverRadius: 0,
							lineTension: 0
						},
				        {
				            label: 'New Deaths',
				            data: this.calculateDailyDifferences('deaths').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
			
			case "hospitalizations.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
						{
							type: 'line',
							label: 'New 7 Day Hospitalization Average',
							data: this.calculateMovingAverage(this.calculateDailyDifferences('hospitalizations').slice(this.graphing.range), 7),
							backgroundColor: 'rgba(255, 255, 255, 0)',
							borderColor: 'rgba(255, 0, 0, 1)',
							borderWidth: 1,
							pointRadius: 0,
							pointHitRadius: 0,
							pointHoverRadius: 0,
							lineTension: 0
						},
				        {
				            label: 'New Hospitalizations',
				            data: this.calculateDailyDifferences('hospitalizations').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
			
			case "tests.new":
				type = 'bar';
				dataset = {
					labels: data.dates.slice(this.graphing.range),
			        datasets: [
						{
							type: 'line',
							label: 'New 7 Day Test Average',
							data: this.calculateMovingAverage(this.calculateDailyDifferences('tests').slice(this.graphing.range), 7),
							backgroundColor: 'rgba(255, 255, 255, 0)',
							borderColor: 'rgba(255, 0, 0, 1)',
							borderWidth: 1,
							pointRadius: 0,
							pointHitRadius: 0,
							pointHoverRadius: 0,
							lineTension: 0
						},
				        {
				            label: 'New Tests',
				            data: this.calculateDailyDifferences('tests').slice(this.graphing.range),
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
				
			case "cases.delta":
				type = 'bar';
				
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
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
				
			case "deaths.delta":
				type = 'bar';
				
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
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
			
			case "hospitalizations.delta":
				type = 'bar';
				
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
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
				        }
			        ]
				}; break;
			
			case "tests.delta":
				type = 'bar';
				
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
					        backgroundColor: 'rgba(54, 162, 235, 1)',
					        borderColor: 'rgba(54, 162, 235, 1)',
				            borderWidth: 0
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
								var val = data.datasets[data.datasets.length - 1].data[item.index];
							
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
			
			if(['new', 'total', 'delta', 'cases', 'per100k', 'deaths', 'hospitalizations', 'tests'].indexOf(g) != -1 || css == 'range') {
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
			document.querySelector("main").style.display = 'block';
		} else {
			document.querySelector("article").innerHTML = '<div class="container">' + data + '</div>';
			document.querySelector("article").style.display = 'block';
			document.querySelector("section#top").style.display = 'none';
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
		    
		var shift_index_negative = CT.data.updated.day == 'Sun' ? -4 : -2,
			shift_index = CT.data.updated.day == 'Sun' ? 4 : 2;
		
		var previous = {
			'Sun': 'Fri',
			'Mon': 'Mon',
			'Tue': 'Tue',
			'Wed': 'Wed',
			'Thu': 'Thu',
			'Fri': 'Fri',
		};
		
		document.querySelector("#updated p span").innerHTML = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()] + ', ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
		
		// cases
		document.querySelector("#stats #stat-cases-new div.val").innerHTML = [
			this.formatWithCommas(
				this.data.cases.data[this.data.cases.data.length - 1] -
				this.data.cases.data[this.data.cases.data.length - 2]
			)
		].join("");

		document.querySelector("#stats #stat-cases-total div.val").innerHTML = this.formatWithCommas(this.data.cases.data[this.data.cases.data.length - 1]);

		document.querySelector("#stats #stat-cases-new div.meta div.delta").innerHTML = [
			this.formatWithDigits(this.calculateDayToDayDelta('cases'), 2) + '%',
			this.formatColumn('cases', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('cases').slice(-1).shift(), 
				this.calculateDailyDifferences('cases').slice(shift_index_negative).shift()
			)) >= 0 ? ' Daily Increase' : ' Daily Decrease'
		].join("");

		document.querySelector("#stats #stat-cases-new div.meta div.discrete").innerHTML = [
			this.formatWithCommas(Math.abs(this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - shift_index) - this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - 1))),
			this.formatColumn('cases', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('cases').slice(-1).shift(), 
				this.calculateDailyDifferences('cases').slice(shift_index_negative).shift()
			)) >= 0 ? ' More Than ' : ' Less Than ',
			previous[CT.data.updated.day] + '.'
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
			this.formatWithDigits(this.calculateDayToDayDelta('deaths'), 2) + '%',
			this.formatColumn('deaths', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('deaths').slice(-1).shift(), 
				this.calculateDailyDifferences('deaths').slice(shift_index_negative).shift()
			)) >= 0 ? ' Daily Increase' : ' Daily Decrease'
		].join("");

		document.querySelector("#stats #stat-deaths-new div.meta div.discrete").innerHTML = [
			this.formatWithCommas(Math.abs(this.calculateDifferenceAtIndex('deaths', this.data.deaths.data.length - shift_index) - this.calculateDifferenceAtIndex('deaths', this.data.deaths.data.length - 1))),
			this.formatColumn('deaths', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('deaths').slice(-1).shift(), 
				this.calculateDailyDifferences('deaths').slice(shift_index_negative).shift()
			)) >= 0 ? ' More Than ' : ' Less Than ',
			previous[CT.data.updated.day] + '.'
		].join("");

		// hospitalization
		if(typeof(this.data.hospitalizations.data) == 'object' && this.data.hospitalizations.data.length > 0) {
			document.querySelector("#stats #stat-hospitalizations-new div.val").innerHTML = [
				this.formatWithCommas(Math.abs(
					this.data.hospitalizations.data[this.data.hospitalizations.data.length - 1] -
					this.data.hospitalizations.data[this.data.hospitalizations.data.length - 2]
				))
			].join("");
			
			document.querySelector("#stats #stat-hospitalizations-total div.val").innerHTML = this.formatWithCommas(this.data.hospitalizations.data[this.data.hospitalizations.data.length - 1]);
			
			document.querySelector("#stats #stat-hospitalizations-new div.meta div.delta").innerHTML = [
				this.formatWithDigits(this.calculateDayToDayDelta('hospitalizations'), 2) + '%',
				this.formatColumn('hospitalizations', this.calculateIncreaseOrDecrease(
					this.calculateDailyDifferences('hospitalizations').slice(-1).shift(), 
					this.calculateDailyDifferences('hospitalizations').slice(shift_index_negative).shift()
				)) >= 0 ? ' Daily Increase' : ' Daily Decrease'
			].join("");

			document.querySelector("#stats #stat-hospitalizations-new div.meta div.discrete").innerHTML = [
				this.formatWithCommas(Math.abs(this.calculateDifferenceAtIndex('hospitalizations', this.data.hospitalizations.data.length - shift_index) - this.calculateDifferenceAtIndex('hospitalizations', this.data.hospitalizations.data.length - 1))),
				this.formatColumn('hospitalizations', this.calculateIncreaseOrDecrease(
					this.calculateDailyDifferences('hospitalizations').slice(-1).shift(), 
					this.calculateDailyDifferences('hospitalizations').slice(shift_index_negative).shift()
				)) >= 0 ? ' More Than ' : ' Less Than ',
				previous[CT.data.updated.day] + '.'
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
			this.formatWithDigits(this.calculateDayToDayDelta('tests'), 2) + '%',
			this.formatColumn('tests', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('tests').slice(-1).shift(), 
				this.calculateDailyDifferences('tests').slice(shift_index_negative).shift()
			)) >= 0 ? ' Daily Increase' : ' Daily Decrease'
		].join("");

		document.querySelector("#stats #stat-tests-new div.meta div.discrete").innerHTML = [
			this.formatWithCommas(Math.abs(this.calculateDifferenceAtIndex('tests', this.data.tests.data.length - shift_index) - this.calculateDifferenceAtIndex('tests', this.data.tests.data.length - 1))),
			this.formatColumn('tests', this.calculateIncreaseOrDecrease(
				this.calculateDailyDifferences('tests').slice(-1).shift(), 
				this.calculateDailyDifferences('tests').slice(shift_index_negative).shift()
			)) >= 0 ? ' More Than ' : ' Less Than ',
			previous[CT.data.updated.day] + '.'
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
		if(['cities', 'counties'].indexOf(this.locationType(this.data.city)) != -1) {
			document.querySelector("#stat-alert-status div.val").innerHTML = '';

			if(this.data.city != 'Connecticut') {
				if(this.calculateCasesPer100K() >= 15) {
					document.querySelector("#stat-alert-status div.val").innerHTML += '<span class="red" title="This city/town has critical levels of infection">Red</span>';
				} else if(this.calculateCasesPer100K() >= 10) {
					document.querySelector("#stat-alert-status div.val").innerHTML += '<span class="orange" title="This city/town has near critical levels of infection">Orange</span>';
				} else if(this.calculateCasesPer100K() >= 5) {
					document.querySelector("#stat-alert-status div.val").innerHTML += '<span class="yellow" title="This city/town has significant levels of infection">Yellow</span>';
				} else {
					document.querySelector("#stat-alert-status div.val").innerHTML += '<span class="white" title="This city/town must has normal levels of infection">Grey</span>';
				}
			}
			
			if(typeof(this.data.colleges) == 'object' && this.data.colleges.length > 0) {
				document.querySelector("#stat-college-university div.val").innerHTML = this.data.colleges.length;
			} else {
				document.querySelector("#stat-college-university div.val").innerHTML = 0;
			}

			document.querySelector("#stats #stat-attack-rate div.val").innerHTML = this.calculateAttackRate();
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

	this.buildDemographicSummaryChart = function(demographic, data_type) {
		var colors = {
			ages: {
				'0-9': 'F29E4C',
				'10-19': 'F1C453',
				'20-29': 'EFEA5A',
				'30-39': 'B9E769',
				'40-49': '83E377',
				'50-59': '16DB93',
				'60-69': '0DB39E',
				'70-79': '048BA8',
				'80 and older': '2C699A'
			},
			ethnicity: {
				'Asian/Pac. Isl.': 'F29E4C',
				'Black': 'F1C453',
				'Hispanic': 'EFEA5A',
				'Multiracial': 'B9E769',
				'Native AK/Am.': '83E377',
				'White': '16DB93'
			},
			genders: {
				'male': '7BDFF2',
				'female': 'F2B5D4'
			}
		};

		if(typeof(colors[demographic]) == 'object') {
			var data = this.data.demographics[demographic][data_type],
				html = [],
				sum = 0;

			for(k in data) {
				for(j in data[k]) {
					sum += parseInt(data[k][j], 10);
					break;
				}
			}

			for(k in data) {
				for(j in data[k]) {
					var first = data[k][j];
					break;
				}

				html.push('<span class="segment" style="background: #' + colors[demographic][k] + '; width: ' + ((first / sum) * 100) + '%"><div class="tooltip"><strong>' + data_type + ': ' + k + '</strong>' + this.formatWithCommas(first) + ' &mdash; ' + this.formatWithDigits((first / sum) * 100, 1) + '%</div></span>');
			}

			return '<div class="graph demographic">' + html.join("") + '<div class="fc"></div></div>';
		}

		return "";
	}

	this.buildLocationOutput = function() {
		var counties = Math.ceil(this.counties.length / 4),
			html = [];

		for(k in this.counties) {
			html.push('<li><a href="#' + this.formatCityName(this.counties[k]) + '">' + this.counties[k] + '</a></li>');
		}

		document.getElementById("locations-counties").innerHTML = [
			'<ul>' + html.slice(0, counties).join("") + '</ul>',
			'<ul>' + html.slice(counties, counties * 2).join("") + '</ul>',
			'<ul>' + html.slice(counties * 2, counties * 3).join("") + '</ul>',
			'<ul>' + html.slice(counties * 3, this.counties.length).join("") + '</ul>',
			'<div class="fc"></div>'
		].join("");
		
		var cities = Math.ceil(this.cities.length / 6),
			html = [];

		for(k in this.cities) {
			html.push('<li><a href="#' + this.formatCityName(this.cities[k]) + '">' + this.cities[k] + '</a></li>');
		}

		document.getElementById("locations-cities").innerHTML = [
			'<ul>' + html.slice(0, cities).join("") + '</ul>',
			'<ul>' + html.slice(cities, cities * 2).join("") + '</ul>',
			'<ul>' + html.slice(cities * 2, cities * 3).join("") + '</ul>',
			'<ul>' + html.slice(cities * 3, cities * 4).join("") + '</ul>',
			'<ul>' + html.slice(cities * 4, cities * 5).join("") + '</ul>',
			'<ul>' + html.slice(cities * 5, this.cities.length).join("") + '</ul>',
			'<div class="fc"></div>'
		].join("");
	},
	
	this.buildSummaryMessage = function() {
		var a = this.calculateTrend('cases', 7, 0),
			b = this.calculateTrend('deaths', 7, 0),
			c = this.calculateSum(this.data.cases.data),
			d = this.calculateSum(this.data.deaths.data);
			
		var message = "";
		
		switch(a + b) {
			case -2: 
				message = (function(a, b, c, d, e) {
					return 'Over the past 7 days, new cases and deaths are <strong class="good">currently decreasing</strong> in ' + e + '. This means that social distancing and wearing face coverings are likely working and, as a result, <strong>new cases are being prevented and lives are being saved</strong>.';
				})(a, b, c, d, this.data.city);
				
				break;
			
			case -1: 
			case 1:
				message = (function(a, b, c, d, e) {
					if(a == -1) {
						return 'Over the past 7 days, new cases are <strong class="good">currently decreasing</strong> in ' + e + ', ' + (d != 0 ? 'however, deaths are <strong class="bad">currently increasing</strong>' : 'thankfully, <strong class="good">there have not been any deaths to date</strong>') + '.';
					} else if(a == 1) {
						return 'Over the past 7 days, new cases are <strong class="bad">currently increasing</strong> in ' + e + ', ' + (d != 0  ? 'however, deaths <strong>have been relatively flat</strong> for several days' : 'thankfully, <strong class="good">there have not been any deaths to date</strong>') + '.';
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
						return 'Over the past 7 days, new cases are <strong class="bad">currently increasing</strong> in ' + e + ', however, deaths are <strong class="good">currently decreasing</strong>.';
					} else {
						return 'Over the past 7 days, new cases are <strong class="good">currently decreasing</strong> in ' + e + ', however, deaths are <strong class="bad">currently increasing</strong>.';
					}
				})(a, b, c, d, this.data.city);
				
				break;
			
			case 2: 
				message = (function(a, b, c, d, e) {
					return 'Over the past 7 days, new cases and new deaths are <strong class="bad">currently increasing</strong> in ' + e + '.';
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
					'<td>' + this.formatWithCommas(this.calculateDifferenceAtIndex('cases', k)) + '</td>',
					'<td>' + this.calculateCasesPer100K(this.data.dates.length - k) + '</td>',
					'<td>' + this.formatWithDigits(this.calculateDelta('cases', k), 2) + '%</td>',
					'<td>' + this.formatWithCommas(this.data.deaths.data[k]) + '</td>',
					'<td>' + this.formatWithCommas(this.calculateDifferenceAtIndex('deaths', k)) + '</td>',
					'<td>' + this.formatWithDigits(this.calculateDelta('deaths', k), 2) + '%</td>',
					'<td>' + this.formatWithCommas(this.data.tests.data[k]) + '</td>',
					'<td>' + this.formatWithCommas(this.calculateDifferenceAtIndex('tests', k)) + '</td>',
				'</tr>'
			].join(""));
			
			if(this.no_data.indexOf(this.data.dates[k]) != -1) {
				html.push([
					'<tr>',
						'<td>' + this.no_data_actual[this.no_data.indexOf(this.data.dates[k])] + '</td>',
						'<td colspan="10">The State of Connecticut did not report data on ' + this.no_data_actual[this.no_data.indexOf(this.data.dates[k])] + '</td>',
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
					'<th>Cases / 100K</th>',
					'<th>Case Delta</th>',
					'<th>Total Deaths</th>',
					'<th>New Deaths</th>',
					'<th>Death Delta</th>',
					'<th>New Tests</td>',
					'<th>Total Tests</td>',
				'</thead>',
				'<tbody>',
					html.reverse().join(""),
				'</tbody>',
				'<tfoot>',
					'<tr>',
						'<td colspan="10"><a href="javascript:;" onclick="javascript:void(CT.toggleTable());">Show All Dates</a></td>',
					'</tr>',
				'</tfoot>',
			'</table>'
		].join("");
	};

	this.buildTableSchool = function() {
		if(this.data.city != 'Connecticut' && this.data.city.indexOf('county') == -1) {
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
						document.querySelector("#schools div.container").innerHTML = [
							'<h3>Cases in ' + this.data.city + ' Schools (K-12 Public Schools) - As of ' + schools[0].date + '</h3>',
							'<p>There have been no known reported cases of COVID-19 in ' + this.data.city + ' public schools.</p>'
						].join("");
					} else {
						document.querySelector("#schools div.container").innerHTML = [
							'<h3>Cases in ' + this.data.city + ' Schools (K-12 Public Schools) - As of ' + schools[0].date + '</h3>',
							'<table width="100%" border="1">',
								'<thead>',
									'<th>School</th>',
									'<th>Total Cases</th>',
								'</thead>',
								'<tbody>',
									html.join(""),
								'</tbody>',
							'</table>',
							'<p>Please Note: Only public schools with at least 1 or more positive case of COVID-19 will be shown above.</p>'
						].join("");
					}
					
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

	this.calculateDayToDayDelta = function(type) {
		var a = this.calculateDifferenceAtIndex(type, this.data[type].data.length - 1),
			b = this.calculateDifferenceAtIndex(type, this.data[type].data.length - (CT.data.updated.day == 'Sun' ? 4 : 2));
		
		if(a == 0 && b == 0) {
			return 0;
		} else if(a == 0 || b == 0) {
			return 100;
		}
		
		return ((a / b) - 1) * 100;
	};
	
	this.calculateDayToDayDifference = function(type) {
		return (
			this.calculateDifferenceAtIndex(type, this.data[type].data.length - 1) - 
			this.calculateDifferenceAtIndex(type, this.data[type].data.length - (CT.data.updated.day == 'Sun' ? 4 : 2))
		);
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
		
		return this.data[type].data[a] - this.data[type].data[b];
	};
	
	this.calculateIncreaseOrDecrease = function(a, b) {
		return a == b ? 0 : (a > b ? 1 : -1);
	};

	this.calculateMovingAverage = function(data, period) {
		var ret = [];

		data = data.reverse();
	
		for(k = period; k < data.length; k++) {
			var start = k - period,
				end = k;
			
			var poi = data.slice(start, end);
	
			var num = poi.reduce(function(a, b) { 
				return parseInt(a, 10) + parseInt(b, 10);
			});

			ret.push(Math.ceil(num / poi.length));
		}

		for(i = 0; i < period; i++) {
			ret.push(null);
		}
	
		return ret.reverse();
	};

	this.calculateCasesPer100K = function(index) {
		index = index || 0;

		if(!isNaN(this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)))) {
			result = (this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)) / this.data.population) * 100000;

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
		var cases = this.calculateDifferenceAtIndex('cases', this.data.cases.data.length - (index || 1)),
			tests = this.calculateDifferenceAtIndex('tests', this.data.tests.data.length - (index || 1));

		if(!isNaN(cases) && !isNaN(tests)) {
			result = (cases / tests) * 100;
		}
		
		return this.formatWithDigits(result || 0, 2) + '%';
	};
	
	this.calculateTrend = function(type, count, variance) {
		var variance = variance || 0;
		
		var data = this.calculateDailyDifferences(type).slice(count * -2);
		
		var a = {
			x: 0,
			y: this.calculateSum(data.slice(0, count)) / count
		};
		
		var b = {
			x: 1,
			y: this.calculateSum(data.slice(count * -1)) / count
		};
		
		var angle = Math.floor(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
		
		return angle != 0 ? (angle > 0 ? 1 : -1) : 0;
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
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta decreasing";
				})(); break;
			case 0: (function() {
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta flat";
				})(); break;
			case 1: (function() {
					document.querySelector("#stat-" + type + "-new div.meta").className = "meta increasing";
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
	};

	// lookup functions
	this.locationType = function(city) {
		if(city == 'connecticut') {
			return 'statewide';
		} else if(city.substring(city.length - 6) == 'county') {
			return 'counties';
		}

		return 'cities';
	};
	
	// ui functions
	this.changeCity = function(city) {
		if(this.validatePage(city)) {
			this.fetchData('pages/' + this.formatCityName(city) + '.txt?' + window.Build);
		} else if(this.validateCity(city)) {
			this.graphing.range = 0;
			this.fetchData('data/' + this.locationType(city) + '/' + this.formatCityName(city) + '.json?' + window.Build);
			
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
			
			this.buildGraph('new', 'segmentation');
			this.buildGraph('cases', 'data');
			this.buildGraph('linear', 'plotting');
			this.buildGraph('0', 'range');
			this.buildPage('data', data);
			this.buildSummaryMessage();
			this.buildStatistics();
			this.buildTable();
			this.buildLocationOutput();
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