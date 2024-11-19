
describe('PetStore API testing', () => {
  const AddPetEndpoint = 'https://petstore.swagger.io/v2/pet'
                     
  //Request enviado para la creación
  const AddPetReq = {
    
      "id": 13457,
      "category": {
        "id": 1,
        "name": "dog"
      },
      "name": "Firu",
      "photoUrls": [
        "https://example.com/photo1.jpg"
      ],
      "tags": [
        {
          "id": 1,
          "name": "Friendly"
        }
      ],
      "status": "available"
    }
  
  //Código para realizar el POST
  const addPet = AddPetReq => {
    cy.request('POST', AddPetEndpoint, AddPetReq)
  }

  //Request body enviado para la actualización de un mascota
  const updateReq = {
    
      "id": 13457,
      "category": {
        "id": 1,
        "name": "dog"
      },
      "name": "Firu",
      "photoUrls": [
        "https://example.com/photo1.jpg"
      ],
      "tags": [
        {
          "id": 1,
          "name": "Friendly"
        }
      ],
      "status": "Pending"
    
  }
  //Código para realizar el PUT (Edición) de una mascota
  const updatePet = updateReq => {
    cy.request('PUT', `${AddPetEndpoint}`, updateReq)
  }

  const deletePet = petToBeDeleted => {
    cy.request('DELETE', `${AddPetEndpoint}/${petToBeDeleted.id}`)
  }

  //Código para realizar el POST (Creación) de una mascota
  it('Create a new Pet', () => {
    addPet (AddPetReq)
  
  //Validamos que este agregado nuestra mascota
    cy.request('GET', `${AddPetEndpoint}/${AddPetReq.id}` )
    .its('body')
    .should('deep.eq', AddPetReq) //Valido que el request que envie coincida con lo que me devuelve el GET
       
      }) 
 
   //Busqueda de la mascota agregada en Test Case anterior
   it('Look for a Pet', () => {
    //Buscamos la mascota agregada anteriormente por id
    cy.request('GET', `${AddPetEndpoint}/${AddPetReq.id}`)
    .then((response)=>{
      const json = response.body;

            // Validar que el id sea el del objeto agregado en el caso anterior
            expect(json.id).to.equal(AddPetReq.id);
    })
       
  }) 


  //Actualización de una mascota
  it('Udate a Pet', () => {
    updatePet(updateReq)
      
    //Validamos que este actualizada nuestra mascota
    cy.request('GET', `${AddPetEndpoint}/${AddPetReq.id}` )
    .its('body')
    .should('deep.eq', updateReq) 
           
      }) 


  //Eliminación de una mascota    
  it('Delete a Pet', () => {
    deletePet(updateReq)
   
   
    //Valido que no este en la lista de mascotas el id eliminado
    cy.request({
      method: 'GET',
      url: `${AddPetEndpoint}/${updateReq.id}`, // Endpoint para obtener la mascota
      failOnStatusCode: false // Evitar que Cypress falle si recibe un 404
    }).then((response) => {
      
      expect(response.status).to.eq(404); //Valida que el codigo sea un Not found

      // Opcional: Verificar el mensaje de error en el cuerpo de la respuesta, si está disponible
      expect(response.body).to.have.property('message', 'Pet not found'); // Mensaje puede variar
    })

  })
})



