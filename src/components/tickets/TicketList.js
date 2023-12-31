import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Tickets.css"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false)
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")                   //gets honey_user out of storage
    const honeyUserObject = JSON.parse(localHoneyUser)                         //convert to json object
    
    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets)
            }
        },
        [emergency]
    )
    
    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`)
                .then(response => response.json())                        // View the initial state of tickets
                .then((ticketArray) => {
                    setTickets(ticketArray)

                })
        },
        []                                              // When this array is empty, you are observing initial component state
    )

    useEffect(
        () => {
            if (honeyUserObject.staff) {               //if it is a staff member show all tickets
                setFiltered(tickets)
           
            }
            else {                                      //otherwise show filtered tickets as defined
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
        [tickets]
        
    )

    useEffect (
        () => {
            if (openOnly) {
                const openTicketArray = tickets.filter(ticket => {
                return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""  
            })
            setFiltered(openTicketArray)
        }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
         }
    },
        [openOnly]
    )
    
        return <>
            {
                honeyUserObject.staff
                ? <> 
                    <button onClick={ () => { setEmergency(true) } } >Emergency Only</button>
                    <button onClick={ () => { setEmergency(false) } } >Show All</button>
                    </>
                : <>
                    <button onClick={ () => navigate("/ticket/create") }>Create Ticket</button>
                    <button onClick={ () => updateOpenOnly(true) }>Open Ticket</button>
                    <button onClick={ () => updateOpenOnly(false) }>All My Tickets</button>
                    </>
            } 

         <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => {
                        return <section className="ticket" key={`ticket--${ticket.id}`}>
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? "/." : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
        </>
        
    }