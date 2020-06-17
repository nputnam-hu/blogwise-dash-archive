import React, { Component } from 'react'
import {
  Icon,
  Intent,
  Dialog,
  Button,
  FormGroup,
  InputGroup,
  HTMLSelect,
  Spinner,
} from '@blueprintjs/core'
import BlueButton from '../../../../../../components/BlueButton'
import EditModal from '../../../../../../components/EditUserModal'
import QuestionHint from '../../../../../../components/QuestionHint'
import errorMessage, { validateState } from '../../../../../../toaster'
import Client from '../../../../../../client'
import userIcon from './user.svg'
import './styles.sass'

function trimString(str) {
  return str ? `${str.slice(0, 25)}...` : ''
}

class Users extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      users: [],
      newName: '',
      newEmail: '',
      newRole: 'WRITER',
      modalIsOpen: false,
      editModalIsOpen: false,
      editModalUser: {},
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/organizations/users').then(users => {
      this.setState({ users, dataLoading: false })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ newRole: e.currentTarget.value })

  openModal = () => this.setState({ modalIsOpen: true })
  handleModalClose = () =>
    this.setState({
      modalIsOpen: false,
      newName: '',
      newEmail: '',
      newRole: '',
    })
  inviteNewUser = async () => {
    if (!validateState(['newName', 'newEmail'], this.state)) {
      return
    }
    const { newName, newRole, newEmail, users } = this.state
    try {
      const { user } = await this.client.post('/users/invite', {
        name: newName,
        email: newEmail,
        type: newRole,
      })

      this.setState({
        modalIsOpen: false,
        newName: '',
        newEmail: '',
        newRole: '',
        users: [...users, user],
      })
    } catch (err) {
      let msg
      switch (err.error.code) {
        case 1006:
          msg = 'A user with that email already exists'
          break
        case 1008:
          msg =
            'Your plan has reached the max number of staff users, please upgrade to invite more users'
          break
        default:
          msg =
            'There was a problem inviting that user, if the problem continues contact support'
          break
      }
      errorMessage(msg)
    }
  }

  editUser = user =>
    this.setState({
      editModalIsOpen: true,
      editModalUser: {
        id: user.id,
        name: user.name || '',
        type: user.type,
        bio: user.bio || '',
        headshotUri: user.headshotUri,
      },
    })
  handleEditModalClose = () =>
    this.setState({ editModalIsOpen: false, editModalUser: {} })
  handleUserEdit = user => {
    const newUsers = this.state.users.reduce((acc, el) => {
      if (el.id === user.id) {
        return [...acc, user]
      }
      return [...acc, el]
    }, [])
    this.setState({
      editModalIsOpen: false,
      editModalUser: {},
      users: newUsers,
    })
  }

  render() {
    const { users } = this.state
    return (
      <div id="users-container">
        <div id="inputcontent">
          <div className="section-header myblog">
            <img src={userIcon} alt="Users" />
            <div style={{ width: '10px' }} />
            <h2>Users & Roles</h2>
            <QuestionHint
              title="Users"
              helperText="New users can be assigned one of two roles: Admin and Writer. Writers can write new content for the blog and publish new posts. Admins, in addition to having the same writing power as Writers, can also manage the blog content and settings on the blogwise dashboard."
            />
            <BlueButton
              className="myblog__button"
              large
              icon="inviteUser"
              onClick={this.openModal}
            >
              Invite User
            </BlueButton>
          </div>
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <table className="bp3-html-table bp3-html-table-striped bp3-interactive users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Bio</th>
                  <th>Invite Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const { name, email, type, token, id, bio } = user
                  return (
                    <tr key={id} onClick={() => this.editUser(user)}>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>{type === 'ADMIN' ? 'Admin' : 'Writer'}</td>
                      <td>{trimString(bio)}</td>
                      <td>{token ? 'Accepted' : 'Pending'}</td>
                      <td>
                        <Icon icon="edit" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        {/* Modals */}
        <Dialog
          icon="new-person"
          isOpen={this.state.modalIsOpen}
          onClose={this.handleModalClose}
          title="Invite User"
        >
          <div style={{ padding: '5px 5% 5px' }}>
            <span style={{ color: '#86969F' }}>
              Enter in the information of who you want to invite. We'll send
              them an email with a link to create an account
            </span>
            <div style={{ padding: '15px 10% 0px' }}>
              <FormGroup htmlFor="newName" label="Name">
                <InputGroup
                  name="newName"
                  placeholder="Steve Jobs"
                  value={this.state.newNname}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup htmlFor="newEmail" label="Email">
                <InputGroup
                  name="newEmail"
                  placeholder="steve@apple.com"
                  value={this.state.newEmail}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup htmlFor="newRole" label="Role">
                <HTMLSelect
                  onChange={this.onSelectChange}
                  options={[
                    { label: 'Writer', value: 'WRITER' },
                    { label: 'Admin', value: 'ADMIN' },
                  ]}
                />
              </FormGroup>
              <br />
              <Button
                large
                intent={Intent.PRIMARY}
                onClick={this.inviteNewUser}
                rightIcon="envelope"
              >
                Invite
              </Button>
            </div>
          </div>
        </Dialog>
        <EditModal
          isOpen={this.state.editModalIsOpen}
          handleClose={this.handleEditModalClose}
          user={this.state.editModalUser}
          handleSave={this.handleUserEdit}
        />
      </div>
    )
  }
}

export default Users
