// gobal variables 
var weeklyRecord = [0,0,0,0,0,0,0]
var intake = 0.0
var goal = 2.4

// It checks if there is a object stored with name "waterHydration" and if true it takes the stored value and assigns to the variable
if(localStorage.getItem("waterHydration") !== null){
    let userData = JSON.parse(localStorage.getItem("waterHydration"))

    document.getElementById(userData.gender).checked = true
    document.getElementById(userData.age).checked = true
    goal = document.getElementById('goal_inpt').value = userData.goal
    intake = userData.intake
    weeklyRecord = userData.weekly
    document.getElementById('progress').setAttribute('progress', intake + ' / ' + goal)
}


// Shows notification to the user
function showNotification(){
    console.log('showNotification')
    const notification = new Notification("Water Drink Reminder",{
        body:  `Intake: ${intake}L, Remaining: ${(goal-intake).toLocaleString('fullwide', {maximumFractionDigits:2})}L`,
        icon:"./assets/notify_logo.png",
    })
}


// takes permission from user and resets intake
const takePermissioin = ()=>{
    Notification.requestPermission().then(permission=>{console.log(permission)})
    intake = 0.0
    saveUserData()

    // Checks if it has permission to show notify and calls showNotification() until the goal is achived(ie goal-intake == 0)
    if(Notification.permission === "granted"){
        setInterval(()=>{
                if(goal-intake > 0){
                    if (goal-intake >= 0.25){
                        showNotification()
                        intake += 0.25
                }else{
                    showNotification()
                    intake += goal-intake
                }
                let date = new Date()
                weeklyRecord[date.getDay()] = intake
                
                let prevObject = JSON.parse(localStorage.getItem("waterHydration"))
                prevObject.intake = intake
                prevObject.weekly = weeklyRecord
                localStorage.setItem("waterHydration",JSON.stringify(prevObject))
                console.log('got notification')

                chart.data.datasets[0].data = [intake,goal-intake];
                chart.update();
                console.log(chart.data.datasets[0].data)

                document.getElementById('progress').setAttribute('progress', intake + ' / ' + goal)
                document.getElementById('bottleC').innerHTML = parseInt(goal-intake)
                document.getElementById('glassC').innerHTML = parseInt(goal-intake) * 2
    
                }
        },5000);
    }
}

// UserData section
const goal_inpt = document.getElementById('goal_inpt')

// It ensures that goal value remains number(float) and it remain greater than 0.5L and less than 10L
goal_inpt.addEventListener('change', (e)=>{

    if (!parseFloat(e.target.value)){
        goal_inpt.value = goal
        return
    }

    goal_inpt.value = parseFloat(e.target.value);

    if (goal_inpt.value.length === 1){
        goal_inpt.style.width = '1rem'
    }else{
        goal_inpt.style.width = '2rem'}

    if (parseFloat(e.target.value) < 0.5){
        goal_inpt.value = '0.5'
        return
    }else if(parseFloat(e.target.value) > 10){
        goal_inpt.value = '10.0'
        return
    }
    let prevObject = JSON.parse(localStorage.getItem("waterHydration"))
    prevObject.goal = parseFloat(e.target.value)
    localStorage.setItem("waterHydration",JSON.stringify(prevObject))
});

// It saves the user Data in local storage and sets their respective goals via switch case
const saveUserData = ()=>{
    let gender = document.querySelector(`input[type="radio"][name="gender"]:checked`).value
    let age = document.querySelector(`input[type="radio"][name="age"]:checked`).value

    if(gender === 'male'){
        switch(age){
            case 'teenager':
                goal = 2.4
                break;
            case 'adult':
                goal = 3.3
                break;
            case 'senior':
                goal = 3.7
                break;
        }
    }else{
        switch(age){
            case 'teenager':
                goal = 2.1
                break;
            case 'adult':
                goal = 2.3
                break;
            case 'senior':
                goal = 2.7
                break;
        }
    }
    document.getElementById('goal_inpt').value = goal


    localStorage.setItem("waterHydration",JSON.stringify({
        gender:gender,
        age:age,
        goal:goal,
        intake:0,
        weekly:weeklyRecord
    }))   
}

// progress

// It uses charts js library to create a pie chart and shows in a canvas
let myChart = document.getElementById('myChart').getContext('2d')

let chart = new Chart(myChart,{
    type: 'pie',
    data:{
        datasets:[{
            data: [intake,parseInt(goal-intake)],
            backgroundColor:['white','#ff7200']
    }]
},
optons:{}
})
// Chart.defaults.elements.bar.borderWidth = 0.1;

// line chart 

let lineChart = document.getElementById('chart_canvas').getContext('2d')
// console.log(goal,intake,weekly)

var ChartLine = new Chart(lineChart,{
    type: 'line',
    data: {
        labels: ["Sun","Mon", "Tues", "Wednes", "Thurs", "Fri", "Sat"],
        datasets: [{
            label: 'Water Intake',
            data: localStorage.getItem('waterHydration').weekly,
            borderColor: '#ff7200',
            borderWidth: 1,
            fill:false
        }]
    },
    options: {
        legend:{
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
})
ChartLine.data.datasets[0].data = weeklyRecord

// It changes the age group images to respective gender

const changeAgeImgM = ()=>{
    document.getElementById('teenImg').setAttribute('src',"./assets/male_teen.png")
    document.getElementById('adultImg').setAttribute('src',"./assets/male_adult.png")
    document.getElementById('seniorImg').setAttribute('src',"./assets/male_senior.png")
}

const changeAgeImgF = ()=>{
    document.getElementById('teenImg').setAttribute('src',"./assets/female_teen.png")
    document.getElementById('adultImg').setAttribute('src',"./assets/female_adult.png")
    document.getElementById('seniorImg').setAttribute('src',"./assets/female_senior.png")
}

let showchart =  document.getElementById('show_chart')
showchart.addEventListener('click',()=>{
    console.log("show ")
    wrapper.style.display='flex'})

let wrapper = document.getElementById('chart_wrapper')
wrapper.addEventListener('click',()=> wrapper.style.display='none')

function addData() {
    console.log(ChartLine.data.datasets[0].data)
    ChartLine.data.datasets[0].data = weeklyRecord;
    ChartLine.update();
    
}