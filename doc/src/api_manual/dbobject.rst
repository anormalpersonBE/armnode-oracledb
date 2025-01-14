.. _dbobjectclass:

*******************
API: DbObject Class
*******************

Calling :meth:`connection.getDbObjectClass()` returns a prototype object
representing a named Oracle Database object or collection. Use
``dbObject.prototype`` on the class to see the available attributes.

Objects of a named DbObject type are: - created from a DbObject
prototype by calling ``new()`` - returned by queries - returned when
using BIND_OUT for an Oracle Database object

See :ref:`Oracle Database Objects and Collections <objects>` for more
information.

The DbObject class was added in node-oracledb 4.0.

.. _dbobjectproperties:

DbObject Properties
===================

The properties of a DbObject object are listed below.

.. attribute:: dbObject.attributes

    This property is an object. When ``dbObject.isCollection`` is *false*,
    this will be an object containing attributes corresponding to the Oracle
    Database object attributes. The name of each attribute follows normal
    Oracle casing semantics.

    Each attribute will have an object that contains:

    - ``type``: the value of one of the :ref:`Oracle Database Type
      Constants <oracledbconstantsdbtype>`, such as 2010 for
      ``oracledb.DB_TYPE_NUMBER`` and 2023 for ``oracledb.DB_TYPE_OBJECT``.
    - ``typeName``: a string corresponding to the type, such as “VARCHAR2”
      or “NUMBER”. When the attribute is a DbObject, it will contain the
      name of the object.
    - ``typeClass``: set if the value of ``type`` is a DbObject. It is the
      DbObject class for the attribute.

    For example:

    .. code-block:: javascript

        attributes: {
          STREET_NUMBER: { type: 2, typeName: 'NUMBER' },
          LOCATION: {
            type: 2023,
            typeName: 'MDSYS.SDO_POINT_TYPE',
            typeClass: [Function]
          }
        }

.. attribute:: dbObject.elementType

    This read-only property is a number. When ``dbObject.isCollection`` is
    *true*, this will have a value corresponding to one of the
    :ref:`Oracle Database Type Constants <oracledbconstantsdbtype>`.

.. attribute:: dbObject.elementTypeClass

    This read-only property is an object.

.. attribute:: dbObject.elementTypeName

    This read-only property is a string. When ``dbObject.isCollection`` is
    *true*, this will have the name of the element type, such as “VARCHAR2”
    or “NUMBER”.

.. attribute:: dbObject.fqn

    This read-only property is a string which specifies the fully qualified
    name of the Oracle Database object or collection.

.. attribute:: dbObject.isCollection

    This read-only property is a boolean value and it is is *true* if the
    Oracle object is a collection, *false* otherwise.

.. attribute:: dbObject.length

    This read-only property is a number. When ``dbObject.isCollection`` is
    *true*, this will have the number of elements in the collection. It is
    undefined for non-collections.

.. attribute:: dbObject.name

    This read-only property is a string which identifies the name of the
    Oracle Database object or collection.

.. attribute:: dbObject.schema

    This read-only property is a string which identifies the schema owning
    the Oracle Database object or collection.

.. _dbobjectmethods:

DbObject Methods
================

.. _dbobjectmethodscolls:

DbObject Methods for Collections
--------------------------------

These methods can be used on Oracle Database collections, identifiable
when :attr:`dbObject.isCollection` is *true*. When collections are fetched
from the database, altered, and then passed back to the database, it may be
more efficient to use these methods directly on the retrieved DbObject than
it is to convert that DbObject to and from a JavaScript object.

.. method:: dbObject.append(value)

    Adds the given value to the end of the collection.

.. method:: dbObject.deleteElement(Number index)

    Deletes the value from collection at the given index.

.. method:: dbObject.getElement(Number index)

    Returns the value associated with the given index.

.. method:: dbObject.getFirstIndex()

    Returns the first index for later use to obtain the value.

.. method:: dbObject.getKeys()

    Returns a JavaScript array containing the ‘index’ keys.

.. method:: dbObject.getLastIndex()

    To obtain the last index for later use to obtain a value.

.. method:: dbObject.getNextIndex(Number index)

    Returns the next index value for later use to obtain a value.

.. method:: dbObject.getPrevIndex(Number index)

    Returns the previous index for later use to obtain the value.

.. method:: dbObject.hasElement(Number index)

    Returns *true* if an element exists in the collection at the given
    index. Returns *false* otherwise.

.. method:: dbObject.setElement(Number index, value)

    To set the given value at the position of the given index.

.. method:: dbObject.getValues()

    Returns an array of element values as a JavaScript array in key order.

.. method:: dbObject.trim(count)

    Trims the specified number of elements from the end of the collection.
