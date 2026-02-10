const start = async() => {
    const data = await fetch('http://localhost:4000/data')
    const dat = await data.json()
    console.log(dat)
}


window.onload = start 