import React, { Component } from 'react'
import { Button, Spinner } from '@blueprintjs/core'
import EditModal from '../../../components/EditUserModal'
import Client from '../../../client'
import './styles.sass'

class WriterHome extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      user: {},
      editModalIsOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/users/me').then(user => {
      this.setState({ user: { ...user } })
    })
  }
  handleUserEdit = user => {
    this.setState({
      editModalIsOpen: false,
      user,
    })
  }
  handleEditModalOpen = () => this.setState({ editModalIsOpen: true })
  handleEditModalClose = () => this.setState({ editModalIsOpen: false })
  render() {
    return (
      <div className="writerhome-container">
        {Object.keys(this.state.user).length === 0 ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <h2>Welcome {this.state.user.name.split(' ')[0]}!</h2>
            <Button icon="edit" onClick={this.handleEditModalOpen}>
              Edit Details
            </Button>
          </React.Fragment>
        )}
        <EditModal
          isOpen={this.state.editModalIsOpen}
          handleClose={this.handleEditModalClose}
          user={this.state.user}
          handleSave={this.handleUserEdit}
        />
      </div>
    )
  }
}

export default WriterHome
