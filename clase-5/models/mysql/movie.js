import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(m.id) id, m.title, m.year, m.director, m.duration, m.poster, m.rate 
        FROM genre g 
        INNER JOIN movie_genres mg ON mg.genre_id = g.id 
        INNER JOIN movie m ON m.id = mg.movie_id  WHERE g.name = ?`,
        [lowerCaseGenre]
      )
      const result = await this.addGenre(movies)
      return result
    }
    const [movies] = await connection.query(
      'select bin_to_uuid(id) id, title, year, director, duration, poster, rate from movie;'
    )
    const result = await this.addGenre(movies)
    return result
  }

  static async getById ({ id }) {
    try {
      const [movie] = await connection.query(
        'select bin_to_uuid(id) id, title, year, director, duration, poster, rate from movie where bin_to_uuid(id)=?;',
        [id]
      )
      if (movie) {
        const result = await this.addGenre(movie)
        return result
      }
    } catch (e) {
      console.log(e)
    }
  }

  static async create ({ input }) {
    // Completo, falta revisar el read ECONNRESET que da exporadicamente
    const { title, year, director, duration, poster, rate, genre } = input
    const uuidResult = await connection.query('select uuid() uuid;')
    const [[{ uuid }]] = uuidResult

    try {
      await connection.query(
        'insert into movie (id, title, year, director, duration, poster, rate) values (UUID_TO_BIN(?),?,?,?,?,?,?)',
        [uuid, title, year, director, duration, poster, rate]
      )
      const genreId = []
      genre.forEach(async (g) => {
        // extraemos el id del genero para insertarlo en la tabla movie_genres
        const [[{ id: idGenre }]] = await connection.query(
          'select id from genre where name = ?', [g])
        // insertamos el id del genero y el de la pelicula en la tabla movie_genres
        await connection.query(
          'insert into movie_genres (movie_id, genre_id) values (UUID_TO_BIN(?),?)', [uuid, idGenre])
        genreId.push(idGenre)
      })
    } catch (e) {
      // de momento mandamos la excepcion a consola hasta implementar otro metodo
      console.log(e)
      // Es importante no enviar información sensible al usuario aqui
      // Seria conventiente mandar la traza del error a un servicio no consultable por usuario
    }

    const [movies] = await connection.query(
      'select bin_to_uuid(id) id, title, year, director, duration, poster, rate from movie where bin_to_uuid(id)=?;',
      [uuid])
    // añadimos el array de generos por pelicula
    movies[0].genre = genre
    return movies[0]
  }

  static async update ({ id, input }) {
    // buscamos la pelicula en la bbdd
    const [movie] = await connection.query(
      'select * from movie where bin_to_uuid(id)  =?',
      [id])
    // montamos el nuevo objeto actualizado con los datos del input
    const genre = input?.genre
    const movieUpdated = { ...movie[0], ...input }
    const { title, year, director, duration, poster, rate } = movieUpdated
    // actualizamos la info de la tabla movie
    await connection.query(
      'UPDATE MOVIE set title = ?, year = ?, director=?, duration=?, poster=?, rate=? where id=uuid_to_bin(?)',
      [title, year, director, duration, poster, rate, id]
    )
    // si viene informado el array de generos, actualizamos la tabla movie_genres
    if (genre) {
      // borramos los generos actuales
      await connection.query(
        'delete from movie_genres where movie_id = uuid_to_bin(?)', [id])
      // insertamos los nuevos
      genre.forEach(async (g) => {
        const [[{ id: genresId }]] = await connection.query(
          'select id from genre where name = ?', [g])
        await connection.query(
          'insert into movie_genres (movie_id, genre_id) values (UUID_TO_BIN(?),?)', [id, genresId])
      })
    }
    return { id, input }
  }

  static async delete ({ id }) {
    // completo, elimina tanto la pelicula como los generos asciados a la misma
    const [movie] = await connection.query(
      'select * from movie where bin_to_uuid(id)  =?',
      [id]
    )
    if (movie) {
      const [{ affectedRows }] = await connection.query(
        'delete from movie where bin_to_uuid(id) = ?',
        [id])
      // borramos las relaciones de la tabla movie_genres
      await connection.query('delete from movie_genres where movie_id = ?', [id])
      if (affectedRows > 0) {
        return true
      }
    }
  }

  static async addGenre (listMovies) {
    // recibe un array de peliculas y le inserta el array de generos por pelicula
    const result = listMovies.map(async (movie) => {
      // extraemos los generos de las peliculas
      const [genres] = await connection.query(
        `SELECT g.name
        FROM movie_genres mg
        INNER JOIN genre g ON mg.genre_id = g.id
        WHERE mg.movie_id = UUID_TO_BIN(?)`, [movie.id])
      const genre = genres.map(g => g.name)
      movie.genre = genre
      return movie
    })
    return Promise.all(result)
  }
}
