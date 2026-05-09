let miGrafica = null

async function convertidorMoneda(){
    try{

        const monedaSeleccionada = document.querySelector("#moneda").value;

        const res = await fetch(`https://mindicador.cl/api/${monedaSeleccionada}`);
        const data = await res.json()
        console.log(data)

        const monto = document.querySelector("#cantidad").value;

        if (monto <= 0){
            alert("Por favor, ingresa un número mayor a 0");
            return;
        }

        resultadoNode = document.querySelector("#resultado-final")

        const pesos = Number(monto);
        const valorMoneda = data.serie[0].valor;
        const calculo = (pesos / valorMoneda).toFixed(2);
        resultadoNode.innerHTML = calculo + " " + monedaSeleccionada.toUpperCase();

        

        const ultimosDiezDias = data.serie.slice(0, 10).reverse()
        const labels = ultimosDiezDias.map(dia => dia.fecha.split("T")[0])
        const valores = ultimosDiezDias.map(dia => dia.valor)

        grafica(labels, valores)


    } catch(error){
        console.warn("Hay un error")
        document.querySelector("#resultado-final").innerHTML = "Error al obtener datos";
    }
}




function grafica(labels, valores){

    const ctx = document.querySelector("#myChart");

    const estilosCSS = getComputedStyle(document.documentElement)
    const colorCSS = estilosCSS.getPropertyValue("--color-linea").trim()
    const fondoCSS = estilosCSS.getPropertyValue("--color-fondo-linea").trim()

    if (miGrafica) {
        miGrafica.destroy();
    }

   miGrafica = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Historial últimos 10 días",
            borderColor: colorCSS,
            backgroundColor: fondoCSS,
            data: valores,
            fill: true
        }]
    }
   })
}

document.querySelector("#btn-convertir").addEventListener("click", convertidorMoneda);

document.querySelector(".borrar").addEventListener("click", () => {
    document.querySelector("#cantidad").value = "";
    document.querySelector("#resultado-final").innerHTML = "0";
   
    if (miGrafica) {
        miGrafica.destroy();
        miGrafica = null;
    }
})



