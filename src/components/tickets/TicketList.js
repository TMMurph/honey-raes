import { useEffect, useState } from "react"
import "./Tickets.css"

export const TicketList = () => {
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFiltered] = useState([])

    const localHoneyUser = localStorage.getItem("honey_user")                   //gets honey_user out of storage
    const honeyUserObject = JSON.parse(localHoneyUser)                         //convert to json object
    
    
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
    
        return <>
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