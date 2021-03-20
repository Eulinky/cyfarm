import React from 'react'
import { func, array } from 'prop-types'
import { withUAL, UALContext } from 'ual-reactjs-renderer'

class ProjectList extends React.Component {

    static propTypes = {
        login: func.isRequired,
        projects: array.isRequired,
        displayError: func.isRequired,
        routeToProject: func.isRequired
    }

    componentDidMount() {
      $(".tilt-img").tilt({
        maxTilt: 15,
        perspective: 1400,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        speed: 1200,
        glare: true,
        maxGlare: 0.2,
        scale: 1.04
      });
    }

    onCreate = async (project) => {
        const { login, displayError, ual: { activeUser } } = this.props

        if (activeUser) {
          this.setState({ loading: true })
          try {           
            const payload = {
              partner: "farmer1",
              projectId: project.id,
              amount: project.requiredAmount
            }
          
            const resp = await fetch('/api/createProject', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            })
          
            const result = await resp.json()
            if (!result.status || result.status !== 'ok') {
                let message = result.message ? result.message : 'Create Project failed';
              throw new Error(message)
            }
    
            this.setState({ liked: true })
          } catch (err) {
            displayError(err)
          }
          this.setState({ loading: false })
        } else {
          login()
        }
      }

    renderCreateButton = (project) => {
      // do not render if project has been created on the blockchain
      return !project.bondTokenInfo ? (
              <button className="btn btn--secondary" onClick={() => this.onCreate(project)}>
              Create 
              </button>) : <div />
    }

    renderTokenInfo = (project) => {
      // do not render if project has been created on the blockchain
      return project.bondTokenInfo ? (
                <p>Needs {project.bondTokenInfo.available_supply.match(/(\d+)/)[0]} of {project.bondTokenInfo.issued_supply.match(/(\d+)/)[0]} EOS</p>
            ) : <div />
    }

    render = () => {
        const { projects, login, displayError, routeToProject } = this.props

        return (
            <React.Fragment>
                <div className="chapter" id="projects">
                    <div className="chapter__inner row__1200">
                        <div className="chapter__title" data-aos="fade-up" data-aos-duration="2000">
                            <h2 className="eksell">Fund a project:</h2>
                        </div>
                        <div className="chapter__p">
            
                        </div>
                    </div>
                </div>
        
                <div className="grid">
                    <div className="grid__inner row__1200">
                        <ul className="grid__ul">
                            { projects.map((p, i) => (
                                <li className="grid-item tilt-img" key={p.id}>
                                    <div data-aos="fade-right"  data-aos-duration="1500" className="grid-item__name">
                                        <h2 onClick={() => routeToProject(p)}>{ p.title }</h2>
                                        <p>{ p.description }</p>
                                        { this.renderTokenInfo(p) }
                                        { this.renderCreateButton(p) }
                                        <button className="btn btn--primary" onClick={() => routeToProject(p)}>
                                        View 
                                        </button>
                                    </div>
                                    <div className="grid-item__img tilt-img" onClick={() => routeToProject(p)}>
                                        <picture data-aos="fade-left">
                                        <img srcSet={p.imagePath} />
                                        </picture>
                                    </div>
                                </li>
                            ))}        
                        </ul>
                    </div>
                </div>
            </React.Fragment>)
        }
    }
  


export default withUAL(ProjectList)
