/*
 * Copyright (C) 2022 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import {act, fireEvent, render} from '@testing-library/react'

import {Search} from '../search'

const fetchPaceContexts = jest.fn()
const setSearchTerm = jest.fn()

const defaultProps = {
  searchTerm: '',
  fetchPaceContexts,
  setSearchTerm,
  contextType: 'section' as const,
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('Search', () => {
  it('renders clear button when searchTerm is present', () => {
    const {getByRole} = render(<Search {...defaultProps} searchTerm="Test" />)

    const clearButton = getByRole('button', {name: 'Clear search'})
    expect(clearButton).toBeInTheDocument()
  })

  it('does not render the clear button when searchTerm is blank', () => {
    const {queryByRole} = render(<Search {...defaultProps} />)

    const clearButton = queryByRole('button', {name: 'Clear search'})
    expect(clearButton).not.toBeInTheDocument()
  })

  it('clears the searchTerm when clear button is clicked', () => {
    const {getByRole} = render(<Search {...defaultProps} searchTerm="Test" />)

    const clearButton = getByRole('button', {name: 'Clear search'})
    act(() => clearButton.click())
    expect(setSearchTerm).toHaveBeenCalledWith('')
  })

  it('calls setSearchTerm when text is entered', () => {
    const {getByPlaceholderText} = render(<Search {...defaultProps} />)

    const searchInput = getByPlaceholderText('Search for sections')
    act(() => {
      fireEvent.change(searchInput, {target: {value: 'A'}})
    })
    expect(setSearchTerm).toHaveBeenCalledWith('A')
  })

  it('calls fetchPaceContexts when the search button is clicked', () => {
    const {getByRole} = render(<Search {...defaultProps} />)

    const searchButton = getByRole('button', {name: 'Search'})
    act(() => searchButton.click())
    expect(fetchPaceContexts).toHaveBeenCalled()
  })

  it('renders placeholder text for section context', () => {
    const {getByPlaceholderText} = render(<Search {...defaultProps} />)

    const searchInput = getByPlaceholderText('Search for sections')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders placeholder text for student_enrollment context', () => {
    const {getByPlaceholderText} = render(
      <Search {...defaultProps} contextType="student_enrollment" />
    )

    const searchInput = getByPlaceholderText('Search for students')
    expect(searchInput).toBeInTheDocument()
  })
})
