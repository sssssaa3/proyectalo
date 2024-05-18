$(document).ready(() => {
  // Ocultar modal de bienvenida después de 1 segundo
  setTimeout(() => { $("#modalBienvenida").css("display", "none") }, 1000)
  // Inicializar elementos de Bootstrap
  const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasBottom')
  const bsOffcanvasWorker = new bootstrap.Offcanvas('#offcanvasWorker')
  const modalErrorProyect = new bootstrap.Modal('#staticBackdrop')
  const modalErrorWorker = new bootstrap.Modal('#staticBackdropWorker')
  // Obtener proyectos al cargar la página
  let proyects = getProyects()

  // Constructor Proyect
  function Proyect(name, trabajadores) {
    this.nameProyect = name;
    this.trabajadores = trabajadores
  }

  Proyect.prototype.getNameProyect = function () {
    return this.nameProyect
  }

  Proyect.prototype.addWorker = function (worker) {
    this.trabajadores.push(worker)
  }

  Proyect.prototype.removeWorker = function (workerName) {
    this.trabajadores = this.trabajadores.filter((worker) => worker.getName() !== workerName)
  }

  Proyect.prototype.searchWorker = function (workerName) {
    return this.trabajadores.filter((worker) => worker.getName().includes(workerName))
  }

  Proyect.prototype.searchAllWorker = function (workerName) {
    return this.trabajadores
  }


  // Constructor Worker
  function Worker(name, rut, role) {
    this.workerName = name;
    this.workerRut = rut;
    this.workerRole = role;

  }

  Worker.prototype.getName = function () {
    return this.workerName
  }

  Worker.prototype.getRut = function () {
    return this.workerRut
  }

  Worker.prototype.getRole = function () {
    return this.workerRole
  }

  Worker.prototype.setName = function (name) {
    this.workerName = name
  }

  Worker.prototype.setRut = function (rut) {
    this.workerRut = rut
  }

  Worker.prototype.setRole = function (role) {
    this.workerRole = role
  }


  //funciones
  function getProyects() {
    const proyects = JSON.parse(sessionStorage.getItem("proyectos"))


    if (proyects && proyects.length > 0) {
      if ($("#noProyects").css("display") === "block") {
        $("#noProyects").fadeToggle()
      }

      const restoredProyect = proyects.map((proyect) => {
        const newProyect = new Proyect(proyect.nameProyect, [])

        if (proyect.trabajadores.length > 0) {
          const nW = proyect.trabajadores.map((trabajador) => new Worker(trabajador.workerName, trabajador.workerRut, trabajador.workerRole))

          newProyect.trabajadores.push(...nW)
        }

        return newProyect

      })

      restoredProyect.forEach((proyect) => {
        createItemProyect(proyect.nameProyect)
      })
      return restoredProyect
    }

    return []
  }

  function createItemProyect(name) {
    const li = $('<li></li>').addClass("list-group-item border-bottom d-flex justify-content-between pt-4 gap-4");
    const divProyect = $('<div>').addClass("d-flex align-items-center gap-4 ");
    const iconProyect = $('<i>').addClass("bi bi-archive");
    const nameProyect = $('<h6>').text(name).addClass("text-break");;

    divProyect.append(iconProyect, nameProyect)


    const divDropdown = $('<div>').addClass("dropdown");
    const iconDropdown = $('<i>').addClass("bi bi-plus-circle dropdown-toggle fs-1 text-primary").attr("data-bs-toggle", "dropdown");

    const ulDropdown = $('<ul>').addClass("dropdown-menu shadow")

    const liAddWorker = $('<li>')
    const pAddWorker = $('<p>').addClass("dropdown-item m-0 text-body-emphasis").attr("data-bs-target", "#offcanvasWorker").attr("data-name", name)


    const iconAddWorker = $('<i>').addClass("bi bi-person-plus me-2");
    const spanAddWorker = $('<span>').text("Agregar Trabajador")
    pAddWorker.append(iconAddWorker, spanAddWorker)
    liAddWorker.append(pAddWorker)


    const liDivider = $('<li>');
    const hrDivider = $('<hr>').addClass("dropdown-divider")
    liDivider.append(hrDivider)



    const liVerProyect = $('<li>').attr("id", "iconVerProyecto").attr("data-name", name)
    const pVerProyect = $('<p>').addClass("dropdown-item m-0 text-primary")
    const iconVerProyect = $('<i>').addClass("bi bi-eye me-2");
    const spanVerProyect = $('<span>').text("Ver Proyecto")
    pVerProyect.append(iconVerProyect, spanVerProyect)
    liVerProyect.append(pVerProyect)

    const liDivider2 = $('<li>');
    const hrDivider2 = $('<hr>').addClass("dropdown-divider")
    liDivider2.append(hrDivider2)

    const liDeleteProyect = $('<li>')
    const pDeleteProyect = $('<p>').addClass("dropdown-item m-0 text-danger").attr("id", "buttonDeleteProyect").attr("data-name", name)
    const iconDeleteProyect = $('<i>').addClass("bi bi-trash me-2");
    const spanDeleteProyect = $('<span>').text("Eliminar Proyecto")
    pDeleteProyect.append(iconDeleteProyect, spanDeleteProyect)
    liDeleteProyect.append(pDeleteProyect);


    ulDropdown.append(liAddWorker, liDivider, liVerProyect, liDivider2, liDeleteProyect)


    divDropdown.append(iconDropdown, ulDropdown)

    li.append(divProyect, divDropdown)

    $("#listProyects").append(li)


  }

  function createFormWorkers(proyect) {

    const form = $('<form>').addClass('d-flex my-3').attr("role", "search");
    const input = $('<input>').addClass('form-control me-2').attr("type", "search").attr("placeholder", "Buscar Trabajador").attr("aria-label", "Search").attr("id", "inputSearchWorker");
    const button = $('<button>').addClass('btn btn-outline-success').attr("id", "buttonSearchWorker").text("Buscar").attr("data-proyect", proyect.getNameProyect());

    form.append(input, button)
    $("#listProyects").append(form)
  }

  function createCardWorkers(proyect, type = false, workersEdit) {
    const card = $('<div>').addClass('card');
    const cardHeader = $('<div>').addClass('card-header').text("Trabajadores");
    const cardBody = $('<div>').addClass('card-body')
    card.append(cardHeader, cardBody);

    const accordion = $('<div>').addClass('accordion ').attr("id", "accordion");

    cardBody.append(accordion);


    if (!type) {
      proyect.trabajadores.forEach((worker) => {

        const accordionItem = $('<div>').addClass('accordion-item')

        const accordionHeader = $('<h2>').addClass('accordion-header')

        const accordionButton = $('<button>').addClass('accordion-button').attr("type", "button").attr("data-bs-toggle", "collapse").attr("data-bs-target", `#collapse${worker.workerRut}`).attr("aria-expanded", "true").attr("aria-controls", `#collapse${worker.workerRut}`).text(worker.getName());



        const accordionCollapse = $('<div>').addClass('accordion-collapse collapse show').attr("id", `collapse${worker.workerRut}`)

        const accordionBody = $('<div>').addClass('accordion-body')

        const listGroup = $('<ul>').addClass('list-group')
        const listGroupItem1 = $('<li>').addClass('list-group-item')
        const listGroupItem2 = $('<li>').addClass('list-group-item')
        const listGroupItem3 = $('<li>').addClass('list-group-item')
        const listGroupItem4 = $('<li>').addClass('list-group-item text-center')

        const listGroupItem1Span = $('<span>').addClass('fw-bold').text("NOMBRE: ")
        const listGroupItem2Span = $('<span>').addClass('fw-bold').text("RUT: ")
        const listGroupItem3Span = $('<span>').addClass('fw-bold').text("ROL: ")

        const listGroupItem4Span = $('<span>').addClass('fst-italic').text(worker.getName())
        const listGroupItem5Span = $('<span>').addClass('fst-italic').text(worker.getRut())
        const listGroupItem6Span = $('<span>').addClass('fst-italic').text(worker.getRole())

        const iconDelete = $('<i>').addClass("bi bi-trash text-danger fs-3 ").attr("id", "deleteWorker").attr("data-worker", worker.getName()).attr("data-proyect", proyect.nameProyect);
        const iconEdit = $('<i>').addClass("bi bi-pencil text-success fs-3 ms-2").attr("id", "editWorker").attr("data-worker", worker.getName()).attr("data-proyect", proyect.nameProyect);
        listGroupItem4.append(iconDelete, iconEdit)

        listGroupItem1.append(listGroupItem1Span, listGroupItem4Span)
        listGroupItem2.append(listGroupItem2Span, listGroupItem5Span)
        listGroupItem3.append(listGroupItem3Span, listGroupItem6Span)


        listGroup.append(listGroupItem1, listGroupItem2, listGroupItem3, listGroupItem4)
        accordionBody.append(listGroup)

        accordionHeader.append(accordionButton)
        accordionItem.append(accordionHeader)
        accordionCollapse.append(accordionBody)
        accordionItem.append(accordionCollapse)


        accordion.append(accordionItem);
        if ($("#buttonRestaurarProyectos").css("display") === "none") {
          $("#buttonRestaurarProyectos").fadeToggle()
        }
      })
    }
    if (type === "search") {
      workersEdit.forEach((worker) => {

        const accordionItem = $('<div>').addClass('accordion-item')

        const accordionHeader = $('<h2>').addClass('accordion-header')

        const accordionButton = $('<button>').addClass('accordion-button').attr("type", "button").attr("data-bs-toggle", "collapse").attr("data-bs-target", `#collapse${worker.workerRut}`).attr("aria-expanded", "true").attr("aria-controls", `#collapse${worker.workerRut}`).text(worker.getName());



        const accordionCollapse = $('<div>').addClass('accordion-collapse collapse show').attr("id", `collapse${worker.workerRut}`)

        const accordionBody = $('<div>').addClass('accordion-body')

        const listGroup = $('<ul>').addClass('list-group')
        const listGroupItem1 = $('<li>').addClass('list-group-item')
        const listGroupItem2 = $('<li>').addClass('list-group-item')
        const listGroupItem3 = $('<li>').addClass('list-group-item')
        const listGroupItem4 = $('<li>').addClass('list-group-item text-center')

        const listGroupItem1Span = $('<span>').addClass('fw-bold').text("NOMBRE: ")
        const listGroupItem2Span = $('<span>').addClass('fw-bold').text("RUT: ")
        const listGroupItem3Span = $('<span>').addClass('fw-bold').text("ROL: ")

        const listGroupItem4Span = $('<span>').addClass('fst-italic').text(worker.getName())
        const listGroupItem5Span = $('<span>').addClass('fst-italic').text(worker.getRut())
        const listGroupItem6Span = $('<span>').addClass('fst-italic').text(worker.getRole())

        const iconDelete = $('<i>').addClass("bi bi-trash text-danger fs-3 ").attr("id", "deleteWorker").attr("data-worker", worker.getName()).attr("data-proyect", proyect.nameProyect);
        const iconEdit = $('<i>').addClass("bi bi-pencil text-success fs-3 ms-2").attr("id", "editWorker").attr("data-worker", worker.getName()).attr("data-proyect", proyect.nameProyect);
        listGroupItem4.append(iconDelete, iconEdit)

        listGroupItem1.append(listGroupItem1Span, listGroupItem4Span)
        listGroupItem2.append(listGroupItem2Span, listGroupItem5Span)
        listGroupItem3.append(listGroupItem3Span, listGroupItem6Span)


        listGroup.append(listGroupItem1, listGroupItem2, listGroupItem3, listGroupItem4)
        accordionBody.append(listGroup)

        accordionHeader.append(accordionButton)
        accordionItem.append(accordionHeader)
        accordionCollapse.append(accordionBody)
        accordionItem.append(accordionCollapse)


        accordion.append(accordionItem);
        if ($("#buttonRestaurarProyectos").css("display") === "none") {
          $("#buttonRestaurarProyectos").fadeToggle()
        }
      })
    }


    $("#listProyects").append(card)

  }

  //eventos 

  $("#buttonProyectName").click(function (event) {
    const form = $(this).closest("form")
    if (form[0].checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
      const value = $("#proyectName").val()
      const normalizedValue = value.trim().toUpperCase();
      if (!normalizedValue) {
        return
      }
      const nameExist = proyects.some((proyect) => proyect.nameProyect === normalizedValue)
      if (nameExist) {
        modalErrorProyect.show()
        $("#proyectName").val("")
        return
      }
      if ($("#noProyects").css("display") === "block") {
        $("#noProyects").fadeToggle()
      }
      createItemProyect(normalizedValue)
      bsOffcanvas.hide()
      $("#proyectName").val("")
      const nuevoProyecto = new Proyect(normalizedValue, [])
      proyects.push(nuevoProyecto)
      sessionStorage.setItem("proyectos", JSON.stringify(proyects))
      console.log(nuevoProyecto instanceof Proyect);
    }
  })

  $("#listProyects").on("click", "#buttonDeleteProyect", function () {
    const nameCaptured = $(this).attr("data-name")
    const newProyects = proyects.filter((proyecto) => proyecto.nameProyect !== nameCaptured)
    proyects = [...newProyects]
    const [li] = $(this).closest("li.list-group-item");
    li.remove()
    if (proyects.length === 0) {
      $("#noProyects").fadeToggle()
    }
    sessionStorage.setItem("proyectos", JSON.stringify(proyects))
    $("#listProyects").empty()
    proyects.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })

    if ($("#buttonRestaurarProyectos").css("display") === "block") {
      $("#buttonRestaurarProyectos").fadeToggle()
    }

  })

  $("#listProyects").on("click", 'p[data-bs-target="#offcanvasWorker"]', function () {
    $("#workerRut").removeAttr("disabled")
    $("#workerProyect").val($(this).attr("data-name"))
    $("#offcanvasWorkerLabel").text("Agregar Trabajador")
    $("#buttonAddWorker").text("Agregar")
    $("#workerName").val("")
    $("#workerRut").val("")
    $("#workerRole").val("")
    bsOffcanvasWorker.show()
  })

  $("#buttonAddWorker").click(function (event) {
    const form = $(this).closest("form")
    const editNameWorker = $(this).attr("nameWorker")

    if (form[0].checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
      const valueName = $("#workerName").val()
      const normalizedValueName = valueName.trim().toUpperCase();

      const valueRut = $("#workerRut").val()
      const normalizedValueRut = valueRut.trim().toUpperCase();

      const valueRole = $("#workerRole").val()
      const normalizedValueRole = valueRole.trim().toUpperCase();

      const proyectName = $("#workerProyect").val()
      const proyectoBuscado = proyects.find((p) => p.nameProyect === proyectName)

      if ($("#offcanvasWorkerLabel").text() === "Agregar Trabajador") {
        const workerExist = proyectoBuscado.trabajadores.some((worker) => worker.workerRut === normalizedValueRut)

        if (workerExist) {
          modalErrorWorker.show()
          $("#workerName").val("")
          $("#workerRut").val("")
          $("#workerRole").val("")
          return
        }
        proyectoBuscado.addWorker(new Worker(normalizedValueName, normalizedValueRut, normalizedValueRole))
      }
      if ($("#offcanvasWorkerLabel").text() === "Editar Trabajador") {
        const workerSearch = proyectoBuscado.trabajadores.find((worker) => worker.workerName === editNameWorker)
        workerSearch.setName(normalizedValueName)
        workerSearch.setRut(normalizedValueRut)
        workerSearch.setRole(normalizedValueRole)
      }
      sessionStorage.setItem("proyectos", JSON.stringify(proyects))
      $("#workerName").val("")
      $("#workerRut").val("")
      $("#workerRole").val("")
      bsOffcanvasWorker.hide()
      const proyectFilter = proyects.filter((proyect) => proyect.nameProyect === proyectName)
      $("#listProyects").empty()
      proyectFilter.forEach((proyect) => {
        createItemProyect(proyect.nameProyect)
      })
      createFormWorkers(proyectFilter[0])
      createCardWorkers(proyectFilter[0])
    }
  })

  $("#buttonSearchProyect").click(function (event) {
    event.preventDefault()
    const value = $("#inputSearchProyect").val()
    if (proyects.length == 0 || !value.trim()) {
      $("#inputSearchProyect").val("")
      return
    }

    const searchResult = proyects.filter((proyect) => proyect.nameProyect.includes(value.toUpperCase().trim()))
    console.log(searchResult);
    $("#listProyects").empty()
    if (searchResult.length > 0) {
      if ($("#noProyectsSearch").css("display") === "block") {
        $("#noProyectsSearch").fadeToggle()
      }
      searchResult.forEach((proyect) => {
        createItemProyect(proyect.nameProyect)
      })
      if ($("#buttonRestaurarProyectos").css("display") === "none") {
        $("#buttonRestaurarProyectos").fadeToggle()
      }
    } else {
      if ($("#noProyectsSearch").css("display") === "none") {
        $("#noProyectsSearch").fadeToggle()
      }
      if ($("#buttonRestaurarProyectos").css("display") === "none") {
        $("#buttonRestaurarProyectos").fadeToggle()
      }
    }
    $("#inputSearchProyect").val("")

  })

  $("#buttonRestaurarProyectos").click(function () {
    $("#listProyects").empty()
    if ($("#noProyectsSearch").css("display") === "block") {
      $("#noProyectsSearch").fadeToggle()
    }
    proyects.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })
    if ($("#buttonRestaurarProyectos").css("display") === "block") {
      $("#buttonRestaurarProyectos").fadeToggle()
    }
  })

  $("#listProyects").on("click", '#iconVerProyecto', function () {
    const name = $(this).attr("data-name")
    const searchResult = proyects.filter((proyect) => proyect.nameProyect.includes(name))
    console.log(searchResult);
    $("#listProyects").empty()
    searchResult.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })
    createFormWorkers(searchResult[0])
    createCardWorkers(searchResult[0])
    if ($("#buttonRestaurarProyectos").css("display") === "none") {
      $("#buttonRestaurarProyectos").fadeToggle()
    }

  })

  $("#listProyects").on("click", '#deleteWorker', function () {
    const nameWorker = $(this).attr("data-worker")
    const proyectNameCap = $(this).attr("data-proyect")
    const proyectFilter = proyects.filter((proyect) => proyect.nameProyect === proyectNameCap)

    proyectFilter[0].removeWorker(nameWorker)
    sessionStorage.setItem("proyectos", JSON.stringify(proyects))
    $("#listProyects").empty()
    proyectFilter.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })
    createFormWorkers(proyectFilter[0])
    createCardWorkers(proyectFilter[0])
  })

  $("#listProyects").on("click", '#editWorker', function () {
    const nameWorker = $(this).attr("data-worker")
    const proyectNameCap = $(this).attr("data-proyect")
    const proyectFilter = proyects.filter((proyect) => proyect.nameProyect === proyectNameCap)
    const workerFilter = proyectFilter[0].trabajadores.find((worker) => worker.workerName === nameWorker)

    $("#offcanvasWorkerLabel").text("Editar Trabajador")
    $("#buttonAddWorker").text("Editar")
    $("#workerProyect").val(proyectNameCap)
    $("#workerName").val(workerFilter.getName())
    $("#workerRut").val(workerFilter.getRut())
    $("#workerRole").val(workerFilter.getRole())
    $("#workerRut").attr("disabled", true)
    $("#buttonAddWorker").attr("nameWorker", workerFilter.getName())
    bsOffcanvasWorker.show()
  })

  $("#listProyects").on("click", '#buttonSearchWorker', function (event) {
    event.preventDefault()
    const value = $("#inputSearchWorker").val()
    const valueNormalized = value.trim().toUpperCase()
    if (!valueNormalized) {
      $("#inputSearchWorker").val("")
      return
    }

    const proyectNameCap = $(this).attr("data-proyect")
    const proyectFilter = proyects.filter((proyect) => proyect.nameProyect === proyectNameCap)
    const workers = proyectFilter[0].searchWorker(valueNormalized)

    $("#listProyects").empty()
    proyectFilter.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })
    createFormWorkers(proyectFilter[0])
    createCardWorkers(proyectFilter[0], "search", workers)
    const button = $('<button>').addClass('btn btn-success mt-2').attr("id", "buttonRestoreAllWorker").text("Restaurar Trabajadores").attr("data-proyect", proyectFilter[0].getNameProyect());
    $("#listProyects").append(button)
  })

  $("#listProyects").on("click", '#buttonRestoreAllWorker', function (event) {
    event.preventDefault()
    const proyectNameCap = $(this).attr("data-proyect")
    const proyectFilter = proyects.filter((proyect) => proyect.nameProyect === proyectNameCap)
    const workers = proyectFilter[0].searchAllWorker()


    $("#listProyects").empty()
    proyectFilter.forEach((proyect) => {
      createItemProyect(proyect.nameProyect)
    })
    createFormWorkers(proyectFilter[0])
    createCardWorkers(proyectFilter[0], "search", workers)
  })

})






